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
import { MailService, type MailMessage } from '../mail/mail.service';
import { SettingsService } from '../settings/settings.service';
import { NewsletterService } from '../newsletter/newsletter.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { currentPrice } from '../products/promo';
import {
  reservationCancelledEmail,
  reservationConfirmationEmail,
  type EmailContext,
} from './reservation-emails';
import { dailySummaryEmail } from './summary-email';
import {
  allowedPickupDates,
  VAN_CODE,
  canCancel,
  codeFromAddress,
  numberPrefix,
  cancelDeadline,
  isValidDateString,
  normalizePhone,
  pickupSlots,
  vanPickupSlots,
  storeHoursOn,
  warsawNow,
  weekdayOf,
} from './reservation-rules';

// statusy: przyjęta (NEW) i anulowana przez klienta (CANCELLED) – obsługa ich nie zmienia
const ACTIVE: ReservationStatus[] = [ReservationStatus.NEW];
const withItems = { items: true } satisfies Prisma.ReservationInclude;

export interface ReservationOptions {
  /** zasady z panelu: godzina zamknięcia, ile dni do przodu, limit na telefon */
  rules: {
    cutoffTime: string;
    maxDaysAhead: number;
    maxActivePerPhone: number;
  };
  dates: string[];
  stores: {
    id: string;
    address: string;
    /** terminy odbioru co 30 min; ostatni najpóźniej 30 min przed zamknięciem */
    slots: Record<string, string[]>;
    /** godziny otwarcia w danym dniu (z panelu) – do podpowiedzi „Odbiór między …” */
    hours: Record<string, { open: string; close: string }>;
    lat: number | null;
    lng: number | null;
  }[];
  vanStops: {
    id: string;
    address: string;
    date: string;
    startTime: string;
    endTime: string;
    /** szacowana godzina przyjścia – co 30 min w czasie postoju (ostatnia 30 min przed odjazdem) */
    slots: string[];
    lat: number | null;
    lng: number | null;
  }[];
}

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
    private readonly settings: SettingsService,
    private readonly newsletter: NewsletterService,
  ) {}

  /* ---------- strona: dostępne terminy i punkty odbioru ---------- */

  async options(): Promise<ReservationOptions> {
    const rules = await this.settings.publicRules();
    const dates = allowedPickupDates(rules);
    const [locations, stops] = await Promise.all([
      this.prisma.location.findMany({ orderBy: { createdAt: 'asc' } }),
      this.prisma.breadVanLocation.findMany(),
    ]);

    const stores = locations
      .map((location) => {
        const slots: Record<string, string[]> = {};
        const openingHours: Record<string, { open: string; close: string }> =
          {};
        for (const date of dates) {
          const hours = storeHoursOn(location.openingHours as never, date);
          if (hours) {
            slots[date] = pickupSlots(hours);
            openingHours[date] = { open: hours[0], close: hours[1] };
          }
        }
        return {
          id: location.id,
          address: location.address,
          slots,
          hours: openingHours,
          lat: location.lat,
          lng: location.lng,
        };
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
          slots: vanPickupSlots(stop.startTime, stop.endTime),
          lat: stop.lat,
          lng: stop.lng,
        })),
    );

    return { rules, dates, stores, vanStops };
  }

  /* ---------- strona: utworzenie rezerwacji ---------- */

  async create(dto: CreateReservationDto, ip = '') {
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
      const { cutoffTime, maxDaysAhead } = options.rules;
      throw new BadRequestException(
        `Ten termin nie jest już dostępny – rezerwacje przyjmujemy do ${cutoffTime} dnia poprzedzającego odbiór, maksymalnie ${maxDaysAhead} ${maxDaysAhead === 1 ? 'dzień' : 'dni'} do przodu`,
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
      if (!dto.pickupTime || !stop.slots.includes(dto.pickupTime)) {
        throw new BadRequestException('Wybierz godzinę odbioru z listy');
      }
      pickupLabel = stop.address;
      pickupTime = dto.pickupTime;
    }

    // produkty: aktywne, dostępne do rezerwacji i (sezonowe) w sezonie, każdy tylko raz
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
        OR: [{ isSeasonal: false }, { inSeason: true }],
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
    if (active >= options.rules.maxActivePerPhone) {
      throw new ConflictException(
        `Na ten numer są już ${active} aktywne rezerwacje. Skontaktuj się z piekarnią, jeśli potrzebujesz więcej.`,
      );
    }

    const items = products.map((p) => ({
      productId: p.id,
      productName: p.name,
      // cena z dnia odbioru: promocyjna tylko, gdy odbiór mieści się w okresie promocji (formularz pokazuje to samo)
      unitPrice: new Prisma.Decimal(currentPrice(p, dto.pickupDate)),
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

    // zaznaczony zapis do newslettera – jak w okienku zapisu (podwójna zgoda: e-mail z linkiem potwierdzającym);
    // błąd zapisu (np. limit prób) nie może zablokować rezerwacji
    if (dto.newsletter)
      this.newsletter
        .subscribe(
          { email: dto.customerEmail.trim().toLowerCase(), consent: true },
          ip,
        )
        .catch((error) =>
          console.error(
            'Nie udało się zapisać do newslettera z rezerwacji',
            error,
          ),
        );

    void this.sendEmail(
      (ctx) => reservationConfirmationEmail(reservation, ctx),
      reservation,
    );
    return this.publicView(reservation);
  }

  /**
   * Numer KOD-MMDD-NN, np. WIL-1017-03: kod punktu, dzień odbioru, kolejna rezerwacja
   * w tym punkcie na ten dzień. Przy równoczesnych rezerwacjach unikalność (data + numer)
   * pilnuje baza – wtedy bierzemy kolejny numer.
   */
  private async createWithUniqueNumber(
    data: Omit<Prisma.ReservationUncheckedCreateInput, 'number'>,
  ) {
    let code = VAN_CODE;
    if (data.pickupType === PickupType.STORE && data.locationId) {
      const location = await this.prisma.location.findUnique({
        where: { id: data.locationId },
        select: { code: true, address: true },
      });
      code = location?.code || codeFromAddress(location?.address ?? '');
    }
    const prefix = numberPrefix(code, data.pickupDate);
    const existing = await this.prisma.reservation.findMany({
      where: { pickupDate: data.pickupDate, number: { startsWith: prefix } },
      select: { number: true },
    });
    const last = Math.max(
      0,
      ...existing.map((r) => Number(r.number.slice(prefix.length)) || 0),
    );

    for (let attempt = 1; attempt <= 5; attempt++) {
      const number = `${prefix}${String(last + attempt).padStart(2, '0')}`;
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
    const { cutoffTime } = await this.settings.reservations();
    if (
      !ACTIVE.includes(reservation.status) ||
      !canCancel(reservation.pickupDate, cutoffTime)
    ) {
      throw new BadRequestException(
        `Tej rezerwacji nie można już anulować – termin minął o ${cutoffTime} dnia poprzedzającego odbiór. Zadzwoń do piekarni.`,
      );
    }
    const cancelled = await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: ReservationStatus.CANCELLED, cancelledAt: new Date() },
      include: withItems,
    });
    void this.sendEmail(
      (ctx) => reservationCancelledEmail(cancelled, ctx),
      cancelled,
    );
    return this.publicView(cancelled);
  }

  /** Dane widoczne dla klienta – bez wewnętrznych identyfikatorów i tokenu */
  private async publicView(
    r: Awaited<ReturnType<ReservationsService['findByToken']>>,
  ) {
    const { cutoffTime } = await this.settings.reservations();
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
      canCancel:
        ACTIVE.includes(r.status) && canCancel(r.pickupDate, cutoffTime),
      cancelDeadline: cancelDeadline(r.pickupDate, cutoffTime),
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

  /**
   * Mail z zestawieniem na dany dzień – na podany adres albo na adresy z ustawień zasad rezerwacji
   * (a gdy ich brak – na e-mail z „Dane kontaktowe”)
   */
  async sendDailySummary(date: string, to?: string) {
    const settings = await this.settings.reservations();
    const recipients = to
      ? [to]
      : settings.summaryEmails.length
        ? settings.summaryEmails
        : [
            (
              await this.prisma.contactInfo.findFirst({
                where: { type: 'EMAIL' },
              })
            )?.value,
          ].filter((e): e is string => !!e);
    if (!recipients.length)
      throw new BadRequestException(
        'Brak adresu odbiorcy – dodaj go w Rezerwacje → Zasady rezerwacji',
      );
    const summary = await this.summary(date);
    const adminUrl =
      this.config.get<string>('ADMIN_URL') ??
      'http://localhost:5173/#/przygotowanie';
    for (const recipient of recipients)
      this.mail.send(
        dailySummaryEmail(
          summary,
          recipient,
          adminUrl,
          this.webUrl(),
          settings.cutoffTime,
        ),
      );
    return {
      sentTo: recipients.join(', '),
      date,
      reservationsCount: summary.reservationsCount,
    };
  }

  /**
   * Retencja danych (RODO): anonimizuje rezerwacje złożone ponad RESERVATION_RETENTION_MONTHS
   * miesięcy temu (domyślnie 6). Znikają dane klienta; produkty, ilości, daty i punkt zostają
   * do statystyk sprzedaży (bez danych osobowych nie podlegają RODO).
   */
  async anonymizeOld(now = new Date()) {
    const configured = Number(
      this.config.get<string>('RESERVATION_RETENTION_MONTHS') ?? 6,
    );
    const months =
      Number.isInteger(configured) && configured >= 1 ? configured : 6;
    const cutoff = new Date(now);
    cutoff.setMonth(cutoff.getMonth() - months);
    const old = await this.prisma.reservation.findMany({
      where: { createdAt: { lt: cutoff }, anonymizedAt: null },
      select: { id: true },
    });
    for (const { id } of old) await this.anonymize(id);
    return {
      anonymized: old.length,
      createdBefore: cutoff.toISOString(),
      months,
    };
  }

  /** Usunięcie danych klienta z rezerwacji (po okresie przechowywania lub na żądanie – art. 17 RODO) */
  async anonymize(id: string) {
    await this.findOne(id);
    return this.prisma.reservation.update({
      where: { id },
      data: {
        customerName: 'Dane usunięte',
        customerPhone: '',
        customerEmail: '',
        notes: null,
        // stary link do anulowania przestaje działać
        cancelToken: `anon-${randomBytes(24).toString('hex')}`,
        anonymizedAt: new Date(),
      },
      include: withItems,
    });
  }

  private webUrl() {
    return this.config.get<string>('WEB_URL') ?? 'http://localhost:3001';
  }

  /** Kontakt i linki do maila: telefon i nawigacja do punktu odbioru, e-mail piekarni, social media */
  private async emailContext(r: {
    locationId: string | null;
    vanStopId: string | null;
  }): Promise<EmailContext> {
    const [location, stop, contact, media] = await Promise.all([
      r.locationId
        ? this.prisma.location.findUnique({ where: { id: r.locationId } })
        : null,
      r.vanStopId
        ? this.prisma.breadVanLocation.findUnique({
            where: { id: r.vanStopId },
          })
        : null,
      this.prisma.contactInfo.findFirst({ where: { type: 'EMAIL' } }),
      this.prisma.media.findMany(),
    ]);
    const point = location ?? stop;
    const navigateUrl =
      point?.lat != null && point?.lng != null
        ? `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`
        : (point?.googleMapsUrl ?? null);
    const order = [
      'INSTAGRAM',
      'FACEBOOK',
      'TIKTOK',
      'YOUTUBE',
      'LINKEDIN',
      'TWITTER',
      'PINTEREST',
    ];
    return {
      webUrl: this.webUrl(),
      cutoffTime: (await this.settings.reservations()).cutoffTime,
      pointPhone: location?.phone ?? null,
      vanHours: stop ? `${stop.startTime}–${stop.endTime}` : null,
      navigateUrl,
      contactEmail: contact?.value ?? null,
      social: media
        .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
        .map((m) => ({ name: m.name, url: m.url })),
    };
  }

  private async sendEmail(
    build: (ctx: EmailContext) => MailMessage,
    r: { locationId: string | null; vanStopId: string | null },
  ) {
    try {
      this.mail.send(build(await this.emailContext(r)));
    } catch (error) {
      // mail nie może zablokować rezerwacji
      console.error('Nie udało się przygotować e-maila', error);
    }
  }
}
