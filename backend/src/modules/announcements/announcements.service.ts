import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { isPromoActive } from '../products/promo';
import type {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from './dto/announcement.dto';

const ORDER = [{ order: 'asc' as const }, { createdAt: 'desc' as const }];

@Injectable()
export class AnnouncementsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Komunikaty widoczne teraz na stronie: włączone i w okresie wyświetlania. Komunikat stały „promo”
   * pojawia się sam, gdy trwa jakakolwiek promocja (bez nazw produktów – zbiorczo), i znika po ostatniej.
   */
  async active() {
    const now = new Date();
    const [list, promoOn] = await Promise.all([
      this.prisma.announcement.findMany({
        where: {
          isActive: true,
          OR: [
            { system: { not: null } },
            {
              AND: [
                { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
                { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
              ],
            },
          ],
        },
        orderBy: ORDER,
        select: {
          id: true,
          message: true,
          linkUrl: true,
          linkLabel: true,
          updatedAt: true,
          system: true,
        },
      }),
      this.anyPromoNow(),
    ]);
    return list
      .filter((a) => a.system !== 'promo' || promoOn)
      .map((a) => ({
        id: a.id,
        message: a.message,
        linkUrl: a.linkUrl,
        linkLabel: a.linkLabel,
        updatedAt: a.updatedAt,
      }));
  }

  /** Czy trwa teraz promocja na jakikolwiek produkt widoczny na stronie (i dostępny – nie poza sezonem) */
  private async anyPromoNow() {
    const products = await this.prisma.product.findMany({
      where: {
        isPromo: true,
        isActive: true,
        OR: [{ isSeasonal: false }, { inSeason: true }],
      },
      select: {
        price: true,
        isPromo: true,
        promoPrice: true,
        promoFrom: true,
        promoTo: true,
      },
    });
    return products.some((p) => isPromoActive(p));
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
    // komunikat stały pokazuje się wtedy, gdy trwa promocja – bez własnych dat
    if (current.system) dto = { ...dto, startsAt: null, endsAt: null };
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
    const current = await this.findOne(id);
    if (current.system)
      throw new BadRequestException(
        'Tego komunikatu nie można usunąć – pokazuje się sam w czasie promocji. Możesz zmienić treść albo go wyłączyć.',
      );
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
