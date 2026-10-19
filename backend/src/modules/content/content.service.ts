import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import deleteImageFiles from '../../scripts/imageHandler';
import { SECTIONS, SECTION_BY_KEY, type Section } from './sections';
import { collectImageUrls, validateFields } from './validate';
import type {
  CreateHeroSlideDto,
  UpdateHeroSlideDto,
} from './dto/hero-slide.dto';

/** Usuwamy tylko pliki wgrane przez panel (/uploads/…), nigdy zdjęć wbudowanych w stronę (/images/…) */
const removeUploads = (urls: string[]) =>
  deleteImageFiles(urls.filter((u) => u.includes('/uploads/')));

const SLIDE_ORDER = [{ order: 'asc' as const }, { createdAt: 'asc' as const }];

/**
 * Treści strony („domowy WordPress”): sekcje (teksty, zdjęcia, przełączniki) według opisu w sections.ts
 * i slajdy karuzeli strony głównej. Brak zapisanej sekcji = wartości domyślne (obecne teksty strony).
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
      fields: s.fields,
      defaults: s.defaults,
      value: this.withDefaults(s, saved.get(s.key)?.data),
      customized: saved.has(s.key),
      updatedAt: saved.get(s.key)?.updatedAt ?? null,
    }));
  }

  async save(key: string, data: unknown) {
    const section = this.section(key);
    const { value, errors } = validateFields(section.fields, data);
    if (errors.length) throw new BadRequestException(errors);
    const previous = await this.prisma.siteContent.findUnique({
      where: { key },
    });
    await this.prisma.siteContent.upsert({
      where: { key },
      create: { key, data: value as Prisma.InputJsonValue },
      update: { data: value as Prisma.InputJsonValue },
    });
    // wgrane zdjęcia, których sekcja już nie używa
    const before = collectImageUrls(
      section.fields,
      this.withDefaults(section, previous?.data),
    );
    const after = new Set(collectImageUrls(section.fields, value));
    await removeUploads(before.filter((u) => !after.has(u)));
    return value;
  }

  /** Przywrócenie tekstów domyślnych sekcji (usunięcie zapisu i wgranych do niej zdjęć) */
  async reset(key: string) {
    const section = this.section(key);
    const previous = await this.prisma.siteContent.findUnique({
      where: { key },
    });
    if (previous) {
      await this.prisma.siteContent.delete({ where: { key } });
      const defaults = new Set(
        collectImageUrls(section.fields, section.defaults),
      );
      await removeUploads(
        collectImageUrls(section.fields, previous.data).filter(
          (u) => !defaults.has(u),
        ),
      );
    }
    return section.defaults;
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

  /* --- karuzela --- */

  /** Dla strony: slajdy włączone i w okresie wyświetlania, w kolejności z panelu */
  activeSlides() {
    const now = new Date();
    return this.prisma.heroSlide.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
        ],
      },
      orderBy: SLIDE_ORDER,
    });
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

  async updateSlide(id: string, dto: UpdateHeroSlideDto) {
    const current = await this.slide(id);
    this.checkDates(
      dto.startsAt === undefined ? current.startsAt : dto.startsAt,
      dto.endsAt === undefined ? current.endsAt : dto.endsAt,
    );
    const updated = await this.prisma.heroSlide.update({
      where: { id },
      data: this.slideData(dto),
    });
    await removeUploads(
      [current.imageUrl, current.mobileImageUrl].filter(
        (u): u is string =>
          !!u && u !== updated.imageUrl && u !== updated.mobileImageUrl,
      ),
    );
    return updated;
  }

  /** Slajdy automatyczne (chlebowóz, piekarnie, sezonowe) można wyłączyć, ale nie usunąć */
  async removeSlide(id: string) {
    const slide = await this.slide(id);
    if (slide.kind !== 'CUSTOM')
      throw new BadRequestException(
        'Tego slajdu nie można usunąć – pokazuje dane z panelu (trasa, piekarnie, produkty sezonowe). Możesz go wyłączyć.',
      );
    await this.prisma.heroSlide.delete({ where: { id } });
    await removeUploads(
      [slide.imageUrl, slide.mobileImageUrl].filter((u): u is string => !!u),
    );
    return slide;
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
