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

@Injectable()
export class BreadVanService {
  constructor(private prisma: PrismaService) {}

  // ===== LOCATIONS =====

  findAllLocations(): Prisma.PrismaPromise<BreadVanLocation[]> {
    return this.prisma.breadVanLocation.findMany({
      orderBy: { dayOfTheWeek: 'asc' },
    });
  }

  async createLocation(
    data: CreateBreadVanLocationDto,
  ): Promise<BreadVanLocation> {
    // WYMAGANIE 2: max 1 rekord na dany dayOfTheWeek
    const existing = await this.prisma.breadVanLocation.findFirst({
      where: { dayOfTheWeek: data.dayOfTheWeek },
    });

    if (existing) {
      throw new BadRequestException(
        'Lokalizacja dla tego dnia tygodnia już istnieje.',
      );
    }

    return this.prisma.breadVanLocation.create({ data });
  }

  async editLocation(
    id: string,
    data: UpdateBreadVanLocationDto,
  ): Promise<BreadVanLocation> {
    // jeśli zmieniasz dayOfTheWeek – też pilnujemy unikalności
    if (data.dayOfTheWeek) {
      const existing = await this.prisma.breadVanLocation.findFirst({
        where: {
          dayOfTheWeek: data.dayOfTheWeek,
          NOT: { id },
        },
      });

      if (existing) {
        throw new BadRequestException(
          'Lokalizacja dla tego dnia tygodnia już istnieje.',
        );
      }
    }

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
            { isMain: 'desc' }, // najpierw główne
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
    data: UpdateBreadVanDescriptionDto,
  ): Promise<BreadVanDescription> {
    // WYMAGANIE 1: dokładnie jeden rekord – edytujemy TEN istniejący
    const existing = await this.prisma.breadVanDescription.findFirst();

    if (!existing) {
      throw new NotFoundException(
        'Opis bread van nie istnieje – powinien zostać utworzony np. przez seed/migrację.',
      );
    }

    return this.prisma.breadVanDescription.update({
      where: { id: existing.id },
      data,
    });
  }
}
