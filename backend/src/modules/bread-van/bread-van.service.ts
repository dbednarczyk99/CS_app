import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, BreadVanLocation } from '@prisma/client';

import { UpdateBreadVanDto } from './dto/update-bread-van.dto';
import { CreateBreadVanDto } from './dto/create-bread-van.dto';

@Injectable()
export class BreadVanService {
  constructor(private prisma: PrismaService) {}

  findAll(): Prisma.PrismaPromise<BreadVanLocation[]> {
    return this.prisma.breadVanLocation.findMany();
  }

  create(data: CreateBreadVanDto): Prisma.PrismaPromise<BreadVanLocation> {
    return this.prisma.breadVanLocation.create({ data });
  }

  remove(id: string): Prisma.PrismaPromise<BreadVanLocation> {
    return this.prisma.breadVanLocation.delete({ where: { id } });
  }

  edit(
    id: string,
    data: UpdateBreadVanDto,
  ): Prisma.PrismaPromise<BreadVanLocation> {
    return this.prisma.breadVanLocation.update({ where: { id }, data });
  }
}
