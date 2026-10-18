import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from './dto/announcement.dto';

const ORDER = [{ order: 'asc' as const }, { createdAt: 'desc' as const }];

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Komunikaty widoczne teraz na stronie: włączone i w okresie wyświetlania */
  active() {
    const now = new Date();
    return this.prisma.announcement.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
        ],
      },
      orderBy: ORDER,
      select: {
        id: true,
        message: true,
        linkUrl: true,
        linkLabel: true,
        updatedAt: true,
      },
    });
  }

  findAll() {
    return this.prisma.announcement.findMany({ orderBy: ORDER });
  }

  async findOne(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
    });
    if (!announcement) throw new NotFoundException('Nie ma takiego komunikatu');
    return announcement;
  }

  create(dto: CreateAnnouncementDto) {
    this.checkDates(dto.startsAt, dto.endsAt);
    return this.prisma.announcement.create({
      data: this.data(dto) as CreateAnnouncementDto,
    });
  }

  async update(id: string, dto: UpdateAnnouncementDto) {
    const current = await this.findOne(id);
    this.checkDates(
      dto.startsAt === undefined ? current.startsAt : dto.startsAt,
      dto.endsAt === undefined ? current.endsAt : dto.endsAt,
    );
    return this.prisma.announcement.update({
      where: { id },
      data: this.data(dto),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.announcement.delete({ where: { id } });
  }

  private data(dto: UpdateAnnouncementDto) {
    return {
      ...dto,
      startsAt:
        dto.startsAt === undefined
          ? undefined
          : dto.startsAt && new Date(dto.startsAt),
      endsAt:
        dto.endsAt === undefined
          ? undefined
          : dto.endsAt && new Date(dto.endsAt),
    };
  }

  private checkDates(
    startsAt?: string | Date | null,
    endsAt?: string | Date | null,
  ) {
    if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) {
      throw new BadRequestException(
        'Data zakończenia musi być późniejsza niż data rozpoczęcia',
      );
    }
  }
}
