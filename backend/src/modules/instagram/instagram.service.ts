import {
  BadRequestException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { mkdir, readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { PrismaService } from '../../prisma/prisma.service';

const SETTINGS_KEY = 'instagram.settings';
const FEED_KEY = 'instagram.feed';
const GRAPH = 'https://graph.instagram.com';
const POSTS = 12;
// zdjęcia zapisywane u nas – strona nie łączy się z Instagramem (szybkość, RODO)
const DIR = join(process.cwd(), 'uploads', 'instagram');
// sekcja znika, gdy ostatnie pobranie się nie udało albo dane są starsze niż doba (+ zapas na jedno pobranie)
const MAX_AGE_MS = 27 * 60 * 60 * 1000;
const MIN_POSTS = 3;
// klucz ważny 60 dni – odnawiamy co tydzień (Instagram pozwala dopiero, gdy klucz ma co najmniej dobę)
const REFRESH_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const TOKEN_DAYS = 60;
const TIMEOUT_MS = 15_000;
// zdjęcia tylko z serwerów Instagrama/Facebooka (bez pobierania dowolnych adresów)
const CDN = /(^|\.)(cdninstagram\.com|fbcdn\.net)$/i;

interface Settings {
  enabled: boolean;
  token: string | null;
  tokenUpdatedAt: string | null;
  tokenExpiresAt: string | null;
}

export interface InstagramPost {
  id: string;
  permalink: string;
  /** ścieżka w /uploads, np. instagram/123.jpg */
  image: string;
  caption: string;
  takenAt: string;
  type: string;
}

interface Feed {
  username: string | null;
  posts: InstagramPost[];
  fetchedAt: string | null;
  lastAttemptAt: string | null;
  error: string | null;
}

const EMPTY_FEED: Feed = {
  username: null,
  posts: [],
  fetchedAt: null,
  lastAttemptAt: null,
  error: null,
};

interface MediaItem {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

/**
 * Ostatnie posty z Instagrama piekarni na stronie (strona główna, kontakt). Klucz dostępu wkleja się w panelu
 * (Marketing → Instagram). Pobieranie co 3 godziny; przy jakimkolwiek problemie sekcja na stronie znika.
 */
@Injectable()
export class InstagramService implements OnApplicationBootstrap {
  private readonly logger = new Logger(InstagramService.name);
  private running: Promise<void> | null = null;

  constructor(private readonly prisma: PrismaService) {}

  onApplicationBootstrap() {
    // po starcie serwera – jeśli dane są stare, pobierz od razu (w tle)
    void this.feed().then(async (feed) => {
      const settings = await this.settings();
      const age = feed.lastAttemptAt
        ? Date.now() - new Date(feed.lastAttemptAt).getTime()
        : Infinity;
      if (settings.enabled && settings.token && age > 3 * 60 * 60 * 1000)
        await this.refresh();
    });
  }

  @Cron('10 */3 * * *', { timeZone: 'Europe/Warsaw' })
  async scheduled() {
    const settings = await this.settings();
    if (settings.enabled && settings.token) await this.refresh();
  }

  /* --- strona --- */

  /** Dla strony: posty tylko wtedy, gdy wszystko działa – inaczej `visible: false` i sekcji nie ma */
  async publicFeed() {
    const [settings, feed] = await Promise.all([this.settings(), this.feed()]);
    const fresh =
      !!feed.fetchedAt &&
      Date.now() - new Date(feed.fetchedAt).getTime() < MAX_AGE_MS;
    const visible =
      settings.enabled &&
      !!settings.token &&
      !feed.error &&
      fresh &&
      !!feed.username &&
      feed.posts.length >= MIN_POSTS;
    if (!visible) return { visible: false as const };
    return {
      visible: true as const,
      username: feed.username,
      profileUrl: `https://www.instagram.com/${feed.username}/`,
      posts: feed.posts.map((p) => ({
        id: p.id,
        permalink: p.permalink,
        image: `/uploads/${p.image}`,
        caption: p.caption,
        takenAt: p.takenAt,
      })),
    };
  }

  /* --- panel --- */

  async adminState() {
    const [settings, feed, site] = await Promise.all([
      this.settings(),
      this.feed(),
      this.publicFeed(),
    ]);
    return {
      enabled: settings.enabled,
      hasToken: !!settings.token,
      tokenUpdatedAt: settings.tokenUpdatedAt,
      tokenExpiresAt: settings.tokenExpiresAt,
      visible: site.visible,
      feed: {
        ...feed,
        posts: feed.posts.map((p) => ({ ...p, image: `/uploads/${p.image}` })),
      },
    };
  }

  /** Zapis z panelu: włącznik i (opcjonalnie) nowy klucz; nowy klucz – od razu próba pobrania */
  async save(dto: { enabled?: boolean; token?: string }) {
    const settings = await this.settings();
    const next: Settings = { ...settings };
    if (dto.enabled !== undefined) next.enabled = dto.enabled;
    if (dto.token !== undefined) {
      const token = dto.token.trim();
      if (token && !/^[A-Za-z0-9_|-]{20,}$/.test(token))
        throw new BadRequestException(
          'To nie wygląda na klucz dostępu Instagrama – skopiuj go jeszcze raz w całości',
        );
      next.token = token || null;
      next.tokenUpdatedAt = token ? new Date().toISOString() : null;
      next.tokenExpiresAt = token
        ? new Date(Date.now() + TOKEN_DAYS * 86400_000).toISOString()
        : null;
    }
    await this.store(SETTINGS_KEY, next);
    if (next.enabled && next.token && dto.token) await this.refresh();
    if (!next.token) await this.store(FEED_KEY, EMPTY_FEED);
    return this.adminState();
  }

  /** Pobranie postów teraz (przycisk w panelu, cron); jedno pobranie naraz */
  async refresh(): Promise<void> {
    if (!this.running)
      this.running = this.fetchFeed().finally(() => (this.running = null));
    return this.running;
  }

  /* --- pobieranie --- */

  private async fetchFeed() {
    const settings = await this.settings();
    const previous = await this.feed();
    const attempt = new Date().toISOString();
    if (!settings.token) return;
    try {
      const token = await this.refreshTokenIfDue(settings);
      const me = await this.graph<{ username: string }>('/me', {
        fields: 'username',
        access_token: token,
      });
      const media = await this.graph<{ data: MediaItem[] }>('/me/media', {
        fields:
          'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
        limit: String(POSTS),
        access_token: token,
      });

      await mkdir(DIR, { recursive: true });
      const posts: InstagramPost[] = [];
      for (const item of media.data) {
        const source =
          item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
        if (!source) continue;
        const file = `${item.id.replace(/\D/g, '')}.jpg`;
        try {
          await this.saveImage(source, join(DIR, file));
        } catch (error) {
          this.logger.warn(
            `Instagram: pominięto zdjęcie ${item.id}: ${(error as Error).message}`,
          );
          continue;
        }
        posts.push({
          id: item.id,
          permalink: item.permalink,
          image: `instagram/${file}`,
          caption: (item.caption ?? '').slice(0, 300),
          takenAt: item.timestamp,
          type: item.media_type,
        });
      }
      await this.removeUnused(posts);
      await this.store(FEED_KEY, {
        username: me.username,
        posts,
        fetchedAt: attempt,
        lastAttemptAt: attempt,
        error: null,
      } satisfies Feed);
      this.logger.log(
        `Instagram: pobrano ${posts.length} postów (@${me.username})`,
      );
    } catch (error) {
      const message = (error as Error).message;
      this.logger.warn(`Instagram: nie udało się pobrać postów – ${message}`);
      await this.store(FEED_KEY, {
        ...previous,
        lastAttemptAt: attempt,
        error: message,
      } satisfies Feed);
    }
  }

  /** Co tydzień nowy klucz (ważny kolejne 60 dni); błąd odnowienia nie blokuje pobrania starym kluczem */
  private async refreshTokenIfDue(settings: Settings): Promise<string> {
    const token = settings.token!;
    const updated = settings.tokenUpdatedAt
      ? new Date(settings.tokenUpdatedAt).getTime()
      : 0;
    if (Date.now() - updated < REFRESH_AFTER_MS) return token;
    try {
      const res = await this.graph<{
        access_token: string;
        expires_in: number;
      }>('/refresh_access_token', {
        grant_type: 'ig_refresh_token',
        access_token: token,
      });
      await this.store(SETTINGS_KEY, {
        ...settings,
        token: res.access_token,
        tokenUpdatedAt: new Date().toISOString(),
        tokenExpiresAt: new Date(
          Date.now() + res.expires_in * 1000,
        ).toISOString(),
      } satisfies Settings);
      this.logger.log('Instagram: odnowiono klucz dostępu');
      return res.access_token;
    } catch (error) {
      this.logger.warn(
        `Instagram: nie udało się odnowić klucza – ${(error as Error).message}`,
      );
      return token;
    }
  }

  private async graph<T>(path: string, params: Record<string, string>) {
    const url = `${GRAPH}${path}?${new URLSearchParams(params).toString()}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    const body = (await res.json().catch(() => ({}))) as {
      error?: { message?: string; code?: number };
    };
    if (!res.ok || body.error) {
      const code = body.error?.code;
      // 190 – klucz nieważny lub wygasł
      throw new Error(
        code === 190
          ? 'klucz dostępu wygasł albo jest nieprawidłowy – wklej nowy w panelu'
          : (body.error?.message ?? `odpowiedź ${res.status}`),
      );
    }
    return body as T;
  }

  private async saveImage(source: string, target: string) {
    if (await exists(target)) return;
    const url = new URL(source);
    if (url.protocol !== 'https:' || !CDN.test(url.hostname))
      throw new Error(`nieoczekiwany adres zdjęcia (${url.hostname})`);
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`zdjęcie: odpowiedź ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    // ponowne zakodowanie: stały kwadrat 640 px, bez metadanych
    await sharp(buffer)
      .rotate()
      .resize(640, 640, { fit: 'cover', position: sharp.strategy.attention })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(target);
  }

  /** Zdjęcia postów, których już nie pokazujemy (usunięte z Instagrama albo starsze niż 12 ostatnich) */
  private async removeUnused(posts: InstagramPost[]) {
    const keep = new Set(posts.map((p) => p.image.replace('instagram/', '')));
    const files = await readdir(DIR).catch(() => [] as string[]);
    await Promise.all(
      files
        .filter((f) => f.endsWith('.jpg') && !keep.has(f))
        .map((f) => unlink(join(DIR, f)).catch(() => undefined)),
    );
  }

  /* --- zapis --- */

  private async settings(): Promise<Settings> {
    const row = await this.prisma.siteContent.findUnique({
      where: { key: SETTINGS_KEY },
    });
    return {
      enabled: false,
      token: null,
      tokenUpdatedAt: null,
      tokenExpiresAt: null,
      ...((row?.data as Partial<Settings> | undefined) ?? {}),
    };
  }

  private async feed(): Promise<Feed> {
    const row = await this.prisma.siteContent.findUnique({
      where: { key: FEED_KEY },
    });
    return {
      ...EMPTY_FEED,
      ...((row?.data as Partial<Feed> | undefined) ?? {}),
    };
  }

  private async store(key: string, data: Settings | Feed) {
    const value = data as unknown as Prisma.InputJsonValue;
    await this.prisma.siteContent.upsert({
      where: { key },
      create: { key, data: value },
      update: { data: value },
    });
  }
}

const exists = (file: string) =>
  stat(file).then(
    () => true,
    () => false,
  );
