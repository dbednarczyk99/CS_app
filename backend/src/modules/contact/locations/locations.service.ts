import {
  BadRequestException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { fetchGoogleRating, type RatingResult } from './google-rating';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateLocationDto } from './dto/location.dto';
import { UpdateLocationDto } from './dto/location.dto';
import deleteImageFiles from '../../../scripts/imageHandler';

const withImages = {
  images: { orderBy: { order: 'asc' } },
} satisfies Prisma.LocationInclude;

type ImageInput = { imgUrl: string; order?: number };

const toImagesCreate = (images: ImageInput[]) =>
  images
    .filter((img) => img?.imgUrl)
    .map((img, index) => ({ imgUrl: img.imgUrl, order: index }));

@Injectable()
export class LocationsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Ocena piekarni w Google (gwiazdki i liczba opinii) – źródło w google-rating.ts (dziś Places API, odświeżanie
   * raz dziennie: kilka piekarni ≈ 150 zapytań/mies. przy 1000 darmowych). Bez klucza GOOGLE_PLACES_API_KEY
   * strona pokazuje tylko link „Oceń nas w Google”. Zwraca wynik (komunikat dla panelu przy błędzie).
   */
  async refreshRating(id: string): Promise<RatingResult | null> {
    const location = await this.prisma.location.findUnique({ where: { id } });
    if (!location?.googlePlaceId) return null;
    const result = await fetchGoogleRating(
      location.googlePlaceId,
      this.config.get<string>('GOOGLE_PLACES_API_KEY'),
    );
    if (!result.ok) {
      if (result.reason !== 'no-key')
        this.logger.warn(
          `Ocena Google dla „${location.name ?? location.address}”: ${result.message}`,
        );
      return result;
    }
    await this.prisma.location.update({
      where: { id },
      data: {
        googleRating: result.value.rating,
        googleRatingCount: result.value.count,
        googleRatingAt: new Date(),
      },
    });
    return result;
  }

  /** Przy starcie serwera – ocena dla piekarni z identyfikatorem, które jej jeszcze nie mają (np. klucz dodany później) */
  async onApplicationBootstrap() {
    const missing = await this.prisma.location.findMany({
      where: { googlePlaceId: { not: null }, googleRatingAt: null },
      select: { id: true },
    });
    for (const { id } of missing) await this.refreshRating(id);
  }

  /** Panel: „Odśwież ocenę teraz” – błąd (brak klucza, zły identyfikator) jako czytelny komunikat */
  async refreshRatingNow(id: string) {
    const result = await this.refreshRating(id);
    if (!result)
      throw new BadRequestException(
        'Najpierw wpisz i zapisz identyfikator miejsca Google (Place ID).',
      );
    if (!result.ok) throw new BadRequestException(result.message);
    return this.findOne(id);
  }

  /** Codziennie o 6:15 – odświeżenie ocen Google wszystkich piekarni z identyfikatorem miejsca */
  @Cron('15 6 * * *', { timeZone: 'Europe/Warsaw' })
  async refreshRatings() {
    const locations = await this.prisma.location.findMany({
      where: { googlePlaceId: { not: null } },
      select: { id: true },
    });
    for (const { id } of locations) await this.refreshRating(id);
  }

  findAll() {
    return this.prisma.location.findMany({
      orderBy: { createdAt: 'asc' },
      include: withImages,
    });
  }

  findOne(id: string) {
    return this.prisma.location.findUnique({
      where: { id },
      include: withImages,
    });
  }

  async create(dto: CreateLocationDto) {
    const { images, ...data } = dto;
    const location = await this.prisma.location.create({
      data: { ...data, images: { create: toImagesCreate(images ?? []) } },
      include: withImages,
    });
    if (location.googlePlaceId) void this.refreshRating(location.id);
    return location;
  }

  /** images: pełny nowy zestaw zdjęć (kolejność = kolejność w tablicy); pliki usuniętych zdjęć są kasowane */
  async update(id: string, dto: UpdateLocationDto) {
    const { images, ...data } = dto;
    let removed: string[] = [];
    let imagesUpdate: Prisma.LocationUpdateInput['images'];

    if (Array.isArray(images)) {
      const next = toImagesCreate(images);
      const current = await this.prisma.locationImage.findMany({
        where: { locationId: id },
      });
      removed = current
        .map((img) => img.imgUrl)
        .filter((url) => !next.some((n) => n.imgUrl === url));
      imagesUpdate = { deleteMany: {}, create: next };
    }

    const before = await this.prisma.location.findUnique({
      where: { id },
      select: { googlePlaceId: true },
    });
    const placeChanged =
      data.googlePlaceId !== undefined &&
      data.googlePlaceId !== before?.googlePlaceId;
    const location = await this.prisma.location.update({
      where: { id },
      data: {
        ...data,
        ...(imagesUpdate ? { images: imagesUpdate } : {}),
        // nowe miejsce – stara ocena nieaktualna (nowa pobierze się zaraz po zapisie)
        ...(placeChanged
          ? {
              googleRating: null,
              googleRatingCount: null,
              googleRatingAt: null,
            }
          : {}),
      },
      include: withImages,
    });
    if (placeChanged && location.googlePlaceId) void this.refreshRating(id);
    if (removed.length) await deleteImageFiles(removed);
    return location;
  }

  async remove(id: string) {
    const location = await this.prisma.location.delete({
      where: { id },
      include: withImages,
    });
    await deleteImageFiles(location.images.map((img) => img.imgUrl));
    return location;
  }
}
