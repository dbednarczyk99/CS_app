import { randomBytes } from 'crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PickupType, Prisma, ReservationStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import {
  reservationCancelledEmail,
  reservationConfirmationEmail,
} from './reservation-emails';
import {
  MAX_ACTIVE_PER_PHONE,
  allowedPickupDates,
  canCancel,
  cancelDeadline,
  isValidDateString,
  normalizePhone,
  pickupSlots,
  storeHoursOn,
  warsawNow,
  weekdayOf,
} from './reservation-rules';

const NUMBER_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ACTIVE: ReservationStatus[] = [
  ReservationStatus.NEW,
  ReservationStatus.READY,
];
const withItems = { items: true } satisfies Prisma.ReservationInclude;

export interface ReservationOptions {
  cutoffHour: number;
  dates: string[];
  stores: { id: string; address: string; slots: Record<string, string[]> }[];
  vanStops: {
    id: string;
    address: string;
    date: string;
    startTime: string;
    endTime: string;
  }[];
}

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  /* ---------- strona: dostępne terminy i punkty odbioru ---------- */

  async options(): Promise<ReservationOptions> {
    const dates = allowedPickupDates();
    const [locations, stops] = await Promise.all([
      this.prisma.location.findMany({ orderBy: { createdAt: 'asc' } }),
      this.prisma.breadVanLocation.findMany(),
    ]);

    const stores = locations
      .map((location) => {
        const slots: Record<string, string[]> = {};
        for (const date of dates) {
          const hours = storeHoursOn(location.openingHours as never, date);
          if (hours) slots[date] = pickupSlots(hours);
        }
        return { id: location.id, address: location.address, slots };
      })
      .filter((store) => Object.keys(store.slots).length > 0);

    const vanStops = dates.flatMap((date) =>
      stops
        .filter((stop) => stop.dayOfTheWeek === weekdayOf(date))
        .map((stop) => ({
          id: stop.id,
          address: stop.address,
          date,
          startTime: stop.startTime,
          endTime: stop.endTime,
        })),
    );

    return { cutoffHour: 18, dates, stores, vanStops };
  }

  /* ---------- strona: utworzenie rezerwacji ---------- */

  async create(dto: CreateReservationDto) {
    if (dto.website)
      throw new BadRequestException('Nie udało się złożyć rezerwacji');

    const phone = normalizePhone(dto.customerPhone);
    if (!phone)
      throw new BadRequestException('Podaj poprawny numer telefonu (9 cyfr)');

    // termin i miejsce odbioru – liczone tak samo jak dla formularza
    const options = await this.options();
    if (
      !isValidDateString(dto.pickupDate) ||
      !options.dates.includes(dto.pickupDate)
    ) {
      throw new BadRequestException(
        'Ten termin nie jest już dostępny – rezerwacje przyjmujemy do 18:00 dnia poprzedzającego odbiór, maksymalnie 5 dni do przodu',
      );
    }

    let pickupLabel: string;
    let pickupTime: string;
    if (dto.pickupType === PickupType.STORE) {
      const store = options.stores.find((s) => s.id === dto.pointId);
      const slots = store?.slots[dto.pickupDate];
      if (!store || !slots)
        throw new BadRequestException(
          'Wybrana piekarnia jest nieczynna w tym dniu',
        );
      if (!dto.pickupTime || !slots.includes(dto.pickupTime)) {
        throw new BadRequestException('Wybierz godzinę odbioru z listy');
      }
      pickupLabel = store.address;
      pickupTime = dto.pickupTime;
    } else {
      const stop = options.vanStops.find(
        (s) => s.id === dto.pointId && s.date === dto.pickupDate,
      );
      if (!stop)
        throw new BadRequestException(
          'Chlebowóz nie zatrzymuje się w tym miejscu w wybranym dniu',
        );
      pickupLabel = stop.address;
      pickupTime = `${stop.startTime}–${stop.endTime}`;
    }

    // produkty: aktywne i dostępne do rezerwacji, każdy tylko raz
    const quantities = new Map<string, number>();
    for (const item of dto.items) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) ?? 0) + item.quantity,
      );
    }
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: [...quantities.keys()] },
        isActive: true,
        isReservable: true,
      },
    });
    if (products.length !== quantities.size) {
      throw new BadRequestException(
        'Część produktów nie jest już dostępna do rezerwacji – odśwież stronę',
      );
    }

    // ochrona przed nadużyciami: limit aktywnych rezerwacji na numer telefonu
    const active = await this.prisma.reservation.count({
      where: {
        customerPhone: phone,
        status: { in: ACTIVE },
        pickupDate: { gte: warsawNow().date },
      },
    });
    if (active >= MAX_ACTIVE_PER_PHONE) {
      throw new ConflictException(
        `Na ten numer są już ${active} aktywne rezerwacje. Skontaktuj się z piekarnią, jeśli potrzebujesz więcej.`,
      );
    }

    const items = products.map((p) => ({
      productId: p.id,
      productName: p.name,
      unitPrice: new Prisma.Decimal(p.price),
      quantity: Math.min(quantities.get(p.id)!, 50),
    }));
    const total = items.reduce(
      (sum, i) => sum.add(i.unitPrice.mul(i.quantity)),
      new Prisma.Decimal(0),
    );

    const reservation = await this.createWithUniqueNumber({
      pickupType: dto.pickupType,
      locationId: dto.pickupType === PickupType.STORE ? dto.pointId : null,
      vanStopId: dto.pickupType === PickupType.VAN ? dto.pointId : null,
      pickupLabel,
      pickupDate: dto.pickupDate,
      pickupTime,
      customerName: dto.customerName.trim(),
      customerPhone: phone,
      customerEmail: dto.customerEmail.trim().toLowerCase(),
      notes: dto.notes?.trim() || null,
      total,
      cancelToken: randomBytes(24).toString('hex'),
      items: { create: items },
    });

    this.mail.send(reservationConfirmationEmail(reservation, this.webUrl()));
    return this.publicView(reservation);
  }

  private async createWithUniqueNumber(
    data: Omit<Prisma.ReservationUncheckedCreateInput, 'number'>,
  ) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const number = `CS-${Array.from(randomBytes(6), (b) => NUMBER_ALPHABET[b % NUMBER_ALPHABET.length]).join('')}`;
      try {
        return await this.prisma.reservation.create({
          data: { ...data, number },
          include: withItems,
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        )
          continue;
        throw error;
      }
    }
    throw new ConflictException(
      'Nie udało się nadać numeru rezerwacji – spróbuj ponownie',
    );
  }

  /* ---------- strona: anulowanie linkiem z e-maila ---------- */

  async findByToken(token: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { cancelToken: token },
      include: withItems,
    });
    if (!reservation) throw new NotFoundException('Nie znaleziono rezerwacji');
    return reservation;
  }

  async publicByToken(token: string) {
    return this.publicView(await this.findByToken(token));
  }

  async cancelByToken(token: string) {
    const reservation = await this.findByToken(token);
    if (reservation.status === ReservationStatus.CANCELLED)
      return this.publicView(reservation);
    if (
      !ACTIVE.includes(reservation.status) ||
      !canCancel(reservation.pickupDate)
    ) {
      throw new BadRequestException(
        'Tej rezerwacji nie można już anulować – termin minął o 18:00 dnia poprzedzającego odbiór. Zadzwoń do piekarni.',
      );
    }
    const cancelled = await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: ReservationStatus.CANCELLED, cancelledAt: new Date() },
      include: withItems,
    });
    this.mail.send(reservationCancelledEmail(cancelled));
    return this.publicView(cancelled);
  }

  /** Dane widoczne dla klienta – bez wewnętrznych identyfikatorów i tokenu */
  private publicView(
    r: Awaited<ReturnType<ReservationsService['findByToken']>>,
  ) {
    return {
      number: r.number,
      status: r.status,
      pickupType: r.pickupType,
      pickupLabel: r.pickupLabel,
      pickupDate: r.pickupDate,
      pickupTime: r.pickupTime,
      customerName: r.customerName,
      customerEmail: r.customerEmail,
      total: r.total,
      items: r.items.map((i) => ({
        productName: i.productName,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
      canCancel: ACTIVE.includes(r.status) && canCancel(r.pickupDate),
      cancelDeadline: cancelDeadline(r.pickupDate),
    };
  }

  /* ---------- panel admina ---------- */

  findAll(filter: {
    status?: string;
    pickupDate?: string;
    pickupType?: string;
    q?: string;
  }) {
    const where: Prisma.ReservationWhereInput = {};
    if (filter.status && filter.status in ReservationStatus)
      where.status = filter.status as ReservationStatus;
    if (filter.pickupDate) where.pickupDate = filter.pickupDate;
    if (filter.pickupType && filter.pickupType in PickupType)
      where.pickupType = filter.pickupType as PickupType;
    if (filter.q) {
      const q = filter.q.trim();
      where.OR = [
        { number: { contains: q.toUpperCase() } },
        { customerName: { contains: q } },
        { customerPhone: { contains: q.replace(/\s/g, '') } },
        { customerEmail: { contains: q.toLowerCase() } },
      ];
    }
    return this.prisma.reservation.findMany({
      where,
      include: withItems,
      orderBy: [
        { pickupDate: 'asc' },
        { pickupTime: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async findOne(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: withItems,
    });
    if (!reservation) throw new NotFoundException('Nie znaleziono rezerwacji');
    return reservation;
  }

  async updateStatus(id: string, status: ReservationStatus) {
    await this.findOne(id);
    return this.prisma.reservation.update({
      where: { id },
      data: {
        status,
        cancelledAt:
          status === ReservationStatus.CANCELLED ? new Date() : undefined,
      },
      include: withItems,
    });
  }

  /** Zestawienie „do przygotowania” na dany dzień: punkty odbioru, sumy produktów, lista rezerwacji */
  async summary(date: string) {
    if (!isValidDateString(date))
      throw new BadRequestException('Nieprawidłowa data');
    const reservations = await this.prisma.reservation.findMany({
      where: { pickupDate: date, status: { not: ReservationStatus.CANCELLED } },
      include: withItems,
      orderBy: [{ pickupTime: 'asc' }, { createdAt: 'asc' }],
    });

    const points = new Map<
      string,
      {
        key: string;
        pickupType: PickupType;
        label: string;
        products: Map<string, number>;
        reservations: typeof reservations;
      }
    >();
    const totals = new Map<string, number>();
    for (const r of reservations) {
      const key = `${r.pickupType}:${r.locationId ?? r.vanStopId ?? r.pickupLabel}`;
      if (!points.has(key)) {
        points.set(key, {
          key,
          pickupType: r.pickupType,
          label: r.pickupLabel,
          products: new Map(),
          reservations: [],
        });
      }
      const point = points.get(key)!;
      point.reservations.push(r);
      for (const item of r.items) {
        point.products.set(
          item.productName,
          (point.products.get(item.productName) ?? 0) + item.quantity,
        );
        totals.set(
          item.productName,
          (totals.get(item.productName) ?? 0) + item.quantity,
        );
      }
    }

    const toList = (m: Map<string, number>) =>
      [...m.entries()]
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity);

    return {
      date,
      reservationsCount: reservations.length,
      totals: toList(totals),
      points: [...points.values()]
        .sort((a, b) =>
          a.pickupType === b.pickupType
            ? a.label.localeCompare(b.label)
            : a.pickupType === 'STORE'
              ? -1
              : 1,
        )
        .map((p) => ({ ...p, products: toList(p.products) })),
    };
  }

  private webUrl() {
    return this.config.get<string>('WEB_URL') ?? 'http://localhost:3001';
  }
}
