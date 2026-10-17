import { Injectable } from '@nestjs/common';
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
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

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

  create(dto: CreateLocationDto) {
    const { images, ...data } = dto;
    return this.prisma.location.create({
      data: { ...data, images: { create: toImagesCreate(images ?? []) } },
      include: withImages,
    });
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

    const location = await this.prisma.location.update({
      where: { id },
      data: { ...data, ...(imagesUpdate ? { images: imagesUpdate } : {}) },
      include: withImages,
    });
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
