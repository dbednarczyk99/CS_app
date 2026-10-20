import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { addRevision, listRevisions } from '../content/revisions';
import { warsawNow } from '../reservations/reservation-rules';
import {
  SERVICE_METRIC,
  type ServiceKey,
  type ServiceSettings,
  validateServiceSettings,
} from './service-settings';

const KEY = 'settings.services';
const REVISIONS_SHOWN = 50;
/** stan mapy (liczony z liczników strony) – odświeżany najwyżej co 30 s */
const STATUS_TTL_MS = 30_000;

export type ServiceState = {
  enabled: boolean;
  limit: number;
  usedToday: number;
  /** dostępna teraz: włączona i poniżej limitu dziennego */
  available: boolean;
  /** dlaczego niedostępna */
  reason: 'off' | 'limit' | null;
};

/**
 * Wyłączniki kosztów: ustawienia (z historią zmian) i sprawdzanie przed każdym użyciem płatnej usługi.
 * E-maile i oceny – licznik w pamięci (zarezerwowany przed wysyłką, więc paczka newslettera nie przekroczy
 * limitu), mapa – liczniki wczytań ze strony (DailyStat).
 */
@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);
  private cached: ServiceSettings | null = null;
  /** dzisiejsze użycie e-maili i ocen (rezerwowane przed wywołaniem) */
  private used: { date: string; emails: number; ratings: number } | null = null;
  private mapsCache: { at: number; count: number } | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  defaults(): ServiceSettings {
    return {
      emailsEnabled: true,
      mapsEnabled: true,
      ratingsEnabled: true,
      emailDailyLimit:
        Number(this.config.get('STATS_EMAIL_DAILY_LIMIT')) || 100,
      mapsDailyLimit: 320,
      ratingsDailyLimit: 30,
    };
  }

  async settings(): Promise<ServiceSettings> {
    if (this.cached) return this.cached;
    const row = await this.prisma.siteContent.findUnique({
      where: { key: KEY },
    });
    this.cached = {
      ...this.defaults(),
      ...((row?.data as Partial<ServiceSettings> | undefined) ?? {}),
    };
    return this.cached;
  }

  /** Dzisiejszy licznik z DailyStat (e-maile: wysłane i nieudane – każda próba kosztuje) */
  private async countToday(service: ServiceKey): Promise<number> {
    const metrics =
      service === 'emails'
        ? ['mail', 'mail_failed']
        : [SERVICE_METRIC[service]];
    const result = await this.prisma.dailyStat.aggregate({
      where: { date: warsawNow().date, metric: { in: metrics } },
      _sum: { count: true },
    });
    return result._sum.count ?? 0;
  }

  private async usedToday(service: 'emails' | 'ratings') {
    const today = warsawNow().date;
    if (this.used?.date !== today)
      this.used = {
        date: today,
        emails: await this.countToday('emails'),
        ratings: await this.countToday('ratings'),
      };
    return this.used[service];
  }

  private async mapsToday() {
    if (this.mapsCache && Date.now() - this.mapsCache.at < STATUS_TTL_MS)
      return this.mapsCache.count;
    const count = await this.countToday('maps');
    this.mapsCache = { at: Date.now(), count };
    return count;
  }

  async state(service: ServiceKey): Promise<ServiceState> {
    const s = await this.settings();
    const enabled =
      service === 'emails'
        ? s.emailsEnabled
        : service === 'maps'
          ? s.mapsEnabled
          : s.ratingsEnabled;
    const limit =
      service === 'emails'
        ? s.emailDailyLimit
        : service === 'maps'
          ? s.mapsDailyLimit
          : s.ratingsDailyLimit;
    const usedToday =
      service === 'maps'
        ? await this.mapsToday()
        : await this.usedToday(service);
    const reason = !enabled ? 'off' : usedToday >= limit ? 'limit' : null;
    return { enabled, limit, usedToday, available: reason === null, reason };
  }

  /**
   * Przed wysłaniem e-maila / zapytaniem o ocenę: czy wolno (włączone i poniżej limitu) – i od razu liczy użycie.
   * false = zablokowane (wyłącznik albo limit dzienny).
   */
  async consume(service: 'emails' | 'ratings'): Promise<boolean> {
    const state = await this.state(service);
    if (!state.available) {
      this.logger.warn(
        `${service === 'emails' ? 'E-mail' : 'Ocena Google'} zablokowany – ${state.reason === 'off' ? 'usługa wyłączona w panelu' : `limit dzienny ${state.limit} wykorzystany`}`,
      );
      return false;
    }
    this.used![service] += 1;
    if (service === 'ratings') this.countRating();
    return true;
  }

  /** Licznik zapytań o oceny (DailyStat „places”) – do statystyk i limitu po restarcie serwera */
  private countRating() {
    this.prisma.$executeRaw`
      INSERT INTO DailyStat (date, metric, \`key\`, count) VALUES (${warsawNow().date}, 'places', '', 1)
      ON DUPLICATE KEY UPDATE count = count + 1`.catch((error: unknown) =>
      this.logger.warn(`Nie udało się zapisać licznika ocen: ${String(error)}`),
    );
  }

  /** Strona: co jest teraz dostępne (bez liczb) */
  async publicStatus() {
    const [emails, maps, ratings] = await Promise.all([
      this.state('emails'),
      this.state('maps'),
      this.state('ratings'),
    ]);
    return {
      emails: emails.available,
      maps: maps.available,
      ratings: ratings.available,
    };
  }

  /** Panel: ustawienia, domyślne, dzisiejsze użycie każdej usługi */
  async forPanel() {
    const row = await this.prisma.siteContent.findUnique({
      where: { key: KEY },
    });
    // świeże liczby z bazy (np. wysyłki sprzed restartu)
    this.used = null;
    this.mapsCache = null;
    const [emails, maps, ratings] = await Promise.all([
      this.state('emails'),
      this.state('maps'),
      this.state('ratings'),
    ]);
    return {
      value: await this.settings(),
      defaults: this.defaults(),
      updatedAt: row?.updatedAt ?? null,
      state: { emails, maps, ratings },
    };
  }

  async save(input: unknown, userId?: string) {
    const { value, errors } = validateServiceSettings(input);
    if (errors.length) throw new BadRequestException(errors);
    const before = await this.settings();
    if (JSON.stringify(before) === JSON.stringify(value))
      return this.forPanel();
    await addRevision(this.prisma, KEY, before, userId);
    await this.prisma.siteContent.upsert({
      where: { key: KEY },
      create: { key: KEY, data: value as unknown as Prisma.InputJsonValue },
      update: { data: value as unknown as Prisma.InputJsonValue },
    });
    this.cached = value;
    return this.forPanel();
  }

  revisions() {
    return listRevisions(this.prisma, KEY, REVISIONS_SHOWN);
  }
}
