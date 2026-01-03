import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Location, Prisma } from '@prisma/client';
import { CreateLocationDto } from './dto/location.dto';
import { UpdateLocationDto } from './dto/location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Prisma.PrismaPromise<Location[]> {
    return this.prisma.location.findMany();
  }

  findOne(id: string): Prisma.PrismaPromise<Location | null> {
    return this.prisma.location.findUnique({ where: { id } });
  }

  create(dto: CreateLocationDto): Prisma.PrismaPromise<Location> {
    return this.prisma.location.create({ data: dto });
  }

  update(id: string, dto: UpdateLocationDto): Prisma.PrismaPromise<Location> {
    return this.prisma.location.update({ where: { id }, data: dto });
  }

  remove(id: string): Prisma.PrismaPromise<Location> {
    return this.prisma.location.delete({ where: { id } });
  }
}
