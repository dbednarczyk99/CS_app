import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HeroSlide, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import deleteImageFiles from '../../scripts/imageHandler';
import { SECTIONS, SECTION_BY_KEY, type Section } from './sections';
import { collectImageUrls, validateFields } from './validate';
import { SLIDE_DEFAULTS } from './hero-defaults';
import type {
  CreateHeroSlideDto,
  UpdateHeroSlideDto,
} from './dto/hero-slide.dto';

/** Usuwamy tylko pliki wgrane przez panel (/uploads/…), nigdy zdjęć wbudowanych w stronę (/images/…) */
const removeUploads = (urls: string[]) =>
  deleteImageFiles(urls.filter((u) => u.includes('/uploads/')));

const SLIDE_ORDER = [{ order: 'asc' as const }, { createdAt: 'asc' as const }];
/** najwyżej tyle włączonych slajdów naraz (wyłączone można trzymać w zapasie bez limitu) */
export const MAX_ACTIVE_SLIDES = 5;
/** tyle ostatnich wersji trzymamy w historii każdej sekcji i każdego slajdu */
const REVISIONS_KEPT = 10;

/** Pola slajdu edytowane w panelu – zapisywane w historii wersji */
const SLIDE_FIELDS = [
  'name',
  'eyebrow',
  'titleLine1',
  'titleLine2',
  'text',
  'cta1Label',
  'cta1Href',
  'cta2Label',
  'cta2Href',
  'imageUrl',
  'imageAlt',
  'imagePosition',
  'mobileImageUrl',
  'mobileImagePosition',
] as const;

const slideSnapshot = (slide: HeroSlide) =>
  Object.fromEntries(SLIDE_FIELDS.map((f) => [f, slide[f]]));
const slideImages = (data: unknown): string[] => {
  const d = (data && typeof data === 'object' ? data : {}) as Record<
    string,
    unknown
  >;
  return [d.imageUrl, d.mobileImageUrl].filter(
    (u): u is string => typeof u === 'string' && !!u,
  );
};
const slideKey = (id: string) => `hero:${id}`;

/**
 * Treści strony („domowy WordPress”): sekcje (teksty, zdjęcia, przełączniki) według opisu w sections.ts
 * i slajdy karuzeli strony głównej. Brak zapisanej sekcji = wartości domyślne (obecne teksty strony).
 * Każdy zapis odkłada poprzednią wersję do historii (10 ostatnich) – zdjęcia z historii nie są usuwane,
 * dopóki jakaś wersja ich używa.
 */
@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  /* --- sekcje --- */

  /** Dla strony: wszystkie sekcje (zapisane albo domyślne) */
  async all() {
    const rows = await this.prisma.siteContent.findMany();
    const saved = new Map(rows.map((r) => [r.key, r.data]));
    return Object.fromEntries(
      SECTIONS.map((s) => [s.key, this.withDefaults(s, saved.get(s.key))]),
    );
  }

  /** Dla panelu: opis sekcji (pola, limity) z aktualną wartością i informacją, czy zmieniona względem domyślnej */
  async sections(page?: string) {
    const rows = await this.prisma.siteContent.findMany();
    const saved = new Map(rows.map((r) => [r.key, r]));
    return SECTIONS.filter((s) => !page || s.page === page).map((s) => ({
      key: s.key,
      page: s.page,
      title: s.title,
      description: s.description,
      seo: s.seo,
      fields: s.fields,
      defaults: s.defaults,
      value: this.withDefaults(s, saved.get(s.key)?.data),
      customized: saved.has(s.key),
      updatedAt: saved.get(s.key)?.updatedAt ?? null,
    }));
  }

  async save(key: string, data: unknown, userId?: string) {
    const section = this.section(key);
    const { value, errors } = validateFields(section.fields, data);
    if (errors.length) throw new BadRequestException(errors);
    const previous = await this.prisma.siteContent.findUnique({
      where: { key },
    });
    const before = this.withDefaults(section, previous?.data);
    // bez zmian – bez zapisu i bez wpisu w historii
    if (JSON.stringify(before) === JSON.stringify(value)) return value;

    // poprzednia wersja (także domyślna przy pierwszym zapisie) → historia
    await this.addRevision(key, before, userId);
    await this.prisma.siteContent.upsert({
      where: { key },
      create: { key, data: value as Prisma.InputJsonValue },
      update: { data: value as Prisma.InputJsonValue },
    });
    await this.pruneRevisions(
      key,
      collectImageUrls(section.fields, value),
      (d) => collectImageUrls(section.fields, d),
    );
    return value;
  }

  /** Przywrócenie tekstów domyślnych sekcji (bieżąca wersja trafia do historii – można to cofnąć) */
  async reset(key: string, userId?: string) {
    const section = this.section(key);
    const previous = await this.prisma.siteContent.findUnique({
      where: { key },
    });
    if (previous) {
      await this.addRevision(key, previous.data, userId);
      await this.prisma.siteContent.delete({ where: { key } });
      await this.pruneRevisions(
        key,
        collectImageUrls(section.fields, section.defaults),
        (d) => collectImageUrls(section.fields, d),
      );
    }
    return section.defaults;
  }

  /** Historia sekcji: wersje sprzed kolejnych zapisów (najnowsza pierwsza) */
  sectionRevisions(key: string) {
    this.section(key);
    return this.revisions(key);
  }

  private section(key: string): Section {
    const section = SECTION_BY_KEY.get(key);
    if (!section) throw new NotFoundException('Nie ma takiej sekcji');
    return section;
  }

  /** Zapis uzupełniony domyślnymi wartościami pól (np. nowe pole dodane po zapisaniu sekcji) */
  private withDefaults(
    section: Section,
    data: unknown,
  ): Record<string, unknown> {
    const saved = (data && typeof data === 'object' ? data : {}) as Record<
      string,
      unknown
    >;
    return Object.fromEntries(
      section.fields.map((f) => [
        f.name,
        f.name in saved ? saved[f.name] : section.defaults[f.name],
      ]),
    );
  }

  /* --- historia wersji --- */

  private async addRevision(key: string, data: unknown, userId?: string) {
    const user = userId
      ? await this.prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, login: true },
        })
      : null;
    await this.prisma.contentRevision.create({
      data: {
        key,
        data: data as Prisma.InputJsonValue,
        createdBy: user?.name || user?.login || null,
      },
    });
  }

  private revisions(key: string) {
    return this.prisma.contentRevision.findMany({
      where: { key },
      orderBy: { createdAt: 'desc' },
      take: REVISIONS_KEPT,
      select: { id: true, data: true, createdBy: true, createdAt: true },
    });
  }

  /**
   * Zostawia 10 najnowszych wersji; wgrane zdjęcia, których nie używa już ani bieżąca wersja, ani żadna
   * z pozostałych w historii – usuwa z serwera.
   */
  private async pruneRevisions(
    key: string,
    currentImages: string[],
    imagesOf: (data: unknown) => string[],
  ) {
    const all = await this.prisma.contentRevision.findMany({
      where: { key },
      orderBy: { createdAt: 'desc' },
      select: { id: true, data: true },
    });
    const kept = all.slice(0, REVISIONS_KEPT);
    const dropped = all.slice(REVISIONS_KEPT);
    if (dropped.length)
      await this.prisma.contentRevision.deleteMany({
        where: { id: { in: dropped.map((r) => r.id) } },
      });
    const used = new Set([
      ...currentImages,
      ...kept.flatMap((r) => imagesOf(r.data)),
    ]);
    // kandydaci do usunięcia: zdjęcia z usuniętych wersji (pozostałe są wciąż w historii albo w użyciu)
    await removeUploads(
      dropped.flatMap((r) => imagesOf(r.data)).filter((u) => !used.has(u)),
    );
  }

  /* --- karuzela --- */

  /** Dla strony: slajdy włączone i w okresie wyświetlania, w kolejności z panelu (najwyżej 5) */
  async activeSlides() {
    const now = new Date();
    const slides = await this.prisma.heroSlide.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
        ],
      },
      orderBy: SLIDE_ORDER,
    });
    return slides.slice(0, MAX_ACTIVE_SLIDES);
  }

  slides() {
    return this.prisma.heroSlide.findMany({ orderBy: SLIDE_ORDER });
  }

  async slide(id: string) {
    const slide = await this.prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) throw new NotFoundException('Nie ma takiego slajdu');
    return slide;
  }

  async createSlide(dto: CreateHeroSlideDto) {
    this.checkDates(dto.startsAt, dto.endsAt);
    if (dto.isActive !== false) await this.checkActiveLimit();
    const last = await this.prisma.heroSlide.aggregate({
      _max: { order: true },
    });
    return this.prisma.heroSlide.create({
      data: {
        ...this.slideData(dto),
        kind: 'CUSTOM',
        order: dto.order ?? (last._max.order ?? 0) + 1,
      } as Prisma.HeroSlideCreateInput,
    });
  }

  async updateSlide(id: string, dto: UpdateHeroSlideDto, userId?: string) {
    const current = await this.slide(id);
    this.checkDates(
      dto.startsAt === undefined ? current.startsAt : dto.startsAt,
      dto.endsAt === undefined ? current.endsAt : dto.endsAt,
    );
    const endsAt =
      dto.endsAt === undefined
        ? current.endsAt
        : dto.endsAt
          ? new Date(dto.endsAt)
          : null;
    const willBeActive =
      (dto.isActive ?? current.isActive) && (!endsAt || endsAt > new Date());
    if (willBeActive) await this.checkActiveLimit(id);

    const before = slideSnapshot(current);
    const updated = await this.prisma.heroSlide.update({
      where: { id },
      data: this.slideData(dto),
    });
    if (JSON.stringify(before) !== JSON.stringify(slideSnapshot(updated))) {
      await this.addRevision(slideKey(id), before, userId);
      await this.pruneRevisions(
        slideKey(id),
        slideImages(updated),
        slideImages,
      );
    }
    return updated;
  }

  /** Slajdy automatyczne (chlebowóz, piekarnie, sezonowe) można wyłączyć, ale nie usunąć */
  async removeSlide(id: string) {
    const slide = await this.slide(id);
    if (slide.kind !== 'CUSTOM')
      throw new BadRequestException(
        'Tego slajdu nie można usunąć – pokazuje dane z panelu (trasa, piekarnie, produkty sezonowe). Możesz go wyłączyć.',
      );
    const history = await this.prisma.contentRevision.findMany({
      where: { key: slideKey(id) },
      select: { data: true },
    });
    await this.prisma.heroSlide.delete({ where: { id } });
    await this.prisma.contentRevision.deleteMany({
      where: { key: slideKey(id) },
    });
    await removeUploads([
      ...slideImages(slide),
      ...history.flatMap((r) => slideImages(r.data)),
    ]);
    return slide;
  }

  /** Historia slajdu (najnowsza pierwsza) i jego stan domyślny (tylko slajdy startowe) */
  async slideHistory(id: string) {
    const slide = await this.slide(id);
    return {
      revisions: await this.revisions(slideKey(id)),
      defaults: slide.defaultKey
        ? (SLIDE_DEFAULTS[slide.defaultKey] ?? null)
        : null,
    };
  }

  /** Najwyżej 5 włączonych slajdów (zakończone – data „Do” minęła – się nie liczą) */
  private async checkActiveLimit(exceptId?: string) {
    const active = await this.prisma.heroSlide.count({
      where: {
        isActive: true,
        OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }],
        ...(exceptId ? { NOT: { id: exceptId } } : {}),
      },
    });
    if (active >= MAX_ACTIVE_SLIDES)
      throw new BadRequestException(
        `Na karuzeli może być najwyżej ${MAX_ACTIVE_SLIDES} włączonych slajdów. Wyłącz najpierw inny slajd albo zapisz ten jako wyłączony.`,
      );
  }

  private slideData(dto: UpdateHeroSlideDto) {
    return {
      ...dto,
      ...(dto.startsAt !== undefined
        ? { startsAt: dto.startsAt ? new Date(dto.startsAt) : null }
        : {}),
      ...(dto.endsAt !== undefined
        ? { endsAt: dto.endsAt ? new Date(dto.endsAt) : null }
        : {}),
    };
  }

  private checkDates(
    startsAt?: string | Date | null,
    endsAt?: string | Date | null,
  ) {
    if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt))
      throw new BadRequestException(
        'Data zakończenia musi być późniejsza niż data rozpoczęcia',
      );
  }
}
