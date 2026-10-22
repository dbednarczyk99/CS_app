import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, BreadVanLocation, BreadVanDescription } from '@prisma/client';

import {
  CreateBreadVanLocationDto,
  // CreateBreadVanDescriptionDto,
} from './dto/create-bread-van.dto';
import {
  UpdateBreadVanLocationDto,
  UpdateBreadVanDescriptionDto,
} from './dto/update-bread-van.dto';

import deleteImageFiles from './../../scripts/imageHandler';

@Injectable()
export class BreadVanService {
  constructor(private prisma: PrismaService) {}

  // ===== LOCATIONS =====

  /** Przystanki w kolejności tygodnia i godzin; dla strony tylko widoczne, dla panelu – wszystkie */
  findAllLocations(
    includeHidden = false,
  ): Prisma.PrismaPromise<BreadVanLocation[]> {
    return this.prisma.breadVanLocation.findMany({
      where: includeHidden ? undefined : { isActive: true },
      orderBy: [{ dayOfTheWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findOneLocation(id: string): Promise<BreadVanLocation> {
    const location = await this.prisma.breadVanLocation.findUnique({
      where: { id },
    });
    if (!location) {
      throw new NotFoundException('Lokalizacja busa nie istnieje.');
    }
    return location;
  }

  async createLocation(
    data: CreateBreadVanLocationDto,
  ): Promise<BreadVanLocation> {
    await this.ensureNoOverlap({ ...data, isActive: data.isActive ?? true });
    return this.prisma.breadVanLocation.create({ data });
  }

  /**
   * Jednego dnia może być kilka przystanków, ale widoczne nie mogą nakładać się godzinami
   * (chlebowóz nie stoi w dwóch miejscach naraz). Ukryte przystanki nie są sprawdzane.
   */
  private async ensureNoOverlap(
    stop: Pick<
      BreadVanLocation,
      'dayOfTheWeek' | 'startTime' | 'endTime' | 'isActive'
    >,
    id?: string,
  ) {
    if (stop.endTime <= stop.startTime) {
      throw new BadRequestException(
        'Godzina zakończenia postoju musi być późniejsza niż rozpoczęcia.',
      );
    }
    if (!stop.isActive) return;
    const sameDay = await this.prisma.breadVanLocation.findMany({
      where: {
        dayOfTheWeek: stop.dayOfTheWeek,
        isActive: true,
        ...(id ? { NOT: { id } } : {}),
      },
    });
    const clash = sameDay.find(
      (other) =>
        stop.startTime < other.endTime && other.startTime < stop.endTime,
    );
    if (clash) {
      throw new BadRequestException(
        `Godziny nakładają się z innym widocznym przystankiem tego dnia: ${clash.address} (${clash.startTime}–${clash.endTime}). Zmień godziny albo ukryj jeden z przystanków.`,
      );
    }
  }

  async editLocation(
    id: string,
    data: UpdateBreadVanLocationDto,
  ): Promise<BreadVanLocation> {
    const current = await this.findOneLocation(id);
    await this.ensureNoOverlap({ ...current, ...data }, id);

    return this.prisma.breadVanLocation.update({
      where: { id },
      data,
    });
  }

  removeLocation(id: string): Prisma.PrismaPromise<BreadVanLocation> {
    return this.prisma.breadVanLocation.delete({ where: { id } });
  }

  // ===== DESCRIPTION (JEDEN REKORD) =====

  async getDescription(): Promise<BreadVanDescription> {
    const description = await this.prisma.breadVanDescription.findFirst({
      include: {
        images: {
          orderBy: [
            { order: 'asc' }, // niższe order najpierw
            { createdAt: 'asc' }, // potem po dacie
          ],
        },
      },
    });

    if (!description) {
      throw new NotFoundException('Opis bread van nie istnieje w bazie.');
    }

    return description;
  }

  async updateDescription(
    dto: UpdateBreadVanDescriptionDto,
  ): Promise<BreadVanDescription> {
    // WYMAGANIE 1: dokładnie jeden rekord – edytujemy TEN istniejący
    const existing = await this.prisma.breadVanDescription.findFirst({
      include: { images: true },
    });
    console.log('working...');
    const { images, ...rest } = dto as any;

    const data: Prisma.BreadVanDescriptionUpdateInput = {
      ...(rest.shortDescription !== undefined
        ? { shortDescription: rest.shortDescription }
        : {}),
      ...(rest.longDescription !== undefined
        ? { longDescription: rest.longDescription }
        : {}),
    };

    let urlsToDelete: string[] = [];

    if (Array.isArray(images)) {
      const newUrls = images
        .filter((img) => img && img.imgUrl)
        .map((img) => img.imgUrl as string);

      const oldUrls = existing?.images?.map((img) => img.imgUrl) ?? [];

      urlsToDelete = oldUrls.filter((url) => !newUrls.includes(url));

      const imagesData = newUrls.map((url, index) => ({
        imgUrl: url,
        order: index,
      }));

      data.images = {
        deleteMany: {},
        create: imagesData,
      };
    }

    if (!existing) {
      throw new NotFoundException(
        'Opis bread van nie istnieje – powinien zostać utworzony np. przez seed/migrację.',
      );
    }

    const updated = await this.prisma.breadVanDescription.update({
      where: { id: existing.id },
      data,
      include: { images: true },
    });

    if (urlsToDelete.length > 0) {
      await deleteImageFiles(urlsToDelete);
    }

    return updated;
  }
}
