import { Injectable, Query } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  findAllTags(@Query('q') q?: string) {
    return this.prisma.articleTag.findMany({
      where: q ? { name: { contains: q } } : undefined,
      take: 20,
    });
  }

  findOneTag(id: string) {
    return this.prisma.articleTag.findUnique({
      where: { id },
    });
  }
}
