import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { warsawNow } from '../reservations/reservation-rules';

// product – wyświetlenie strony produktu (klucz: id produktu)
export type Metric =
  | 'view'
  | 'map'
  | 'source'
  | 'product'
  | 'mail'
  | 'mail_failed';

// podstrony strony (dynamiczne ścieżki sprowadzone do wzorca) – inne adresy liczą się jako „(inne)”
export const VIEW_KEYS = [
  '/',
  '/oferta',
  '/oferta/[produkt]',
  '/piekarnie',
  '/chlebowoz',
  '/o-nas',
  '/aktualnosci',
  '/aktualnosci/[wpis]',
  '/kontakt',
  '/rezerwacja',
  '/rezerwacja/anuluj',
  '/newsletter',
  '/regulamin',
  '/polityka-prywatnosci',
  '(inne)',
];
// miejsca, w których wczytuje się mapa Google
export const MAP_KEYS = ['piekarnie', 'chlebowoz', 'rezerwacja'];
// skąd przyszedł odwiedzający (kategoria – bez adresów stron odsyłających)
export const SOURCE_KEYS = [
  'bezposrednio',
  'google',
  'inne-wyszukiwarki',
  'instagram',
  'facebook',
  'tiktok',
  'newsletter',
  'inne-strony',
];

const DAY_MS = 24 * 60 * 60 * 1000;

/** YYYY-MM-DD przesunięte o `days` */
const shiftDate = (date: string, days: number) =>
  new Date(Date.parse(`${date}T12:00:00Z`) + days * DAY_MS)
    .toISOString()
    .slice(0, 10);

const number = (config: ConfigService, key: string, fallback: number) => {
  const value = Number(config.get<string>(key));
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

/**
 * Statystyki strony: dzienne liczniki w tabeli DailyStat (bez adresów IP, cookies i identyfikatorów)
 * oraz zestawienie dla panelu z limitami planów (e-maile, Mapy Google) i szacunkiem kosztów.
 */
@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** +1 do licznika dnia (atomowo); błąd statystyk nigdy nie przerywa właściwej operacji */
  increment(metric: Metric, key = ''): void {
    const date = warsawNow().date;
    this.prisma.$executeRaw`
      INSERT INTO DailyStat (date, metric, \`key\`, count) VALUES (${date}, ${metric}, ${key.slice(0, 60)}, 1)
      ON DUPLICATE KEY UPDATE count = count + 1`
      .then(() => undefined)
      .catch((error: unknown) =>
        this.logger.warn(`Nie udało się zapisać statystyki: ${String(error)}`),
      );
  }

  /** Wyświetlenie strony produktu – liczone tylko dla istniejącego, aktywnego produktu */
  async incrementProduct(productId: string): Promise<void> {
    const exists = await this.prisma.product
      .count({ where: { id: productId, isActive: true } })
      .catch(() => 0);
    if (exists) this.increment('product', productId);
  }

  limits() {
    return {
      // Resend Free: 100 dziennie, 3000 miesięcznie (dokument 05-Koszty) – ustawić zgodnie z wybranym planem
      emailDaily: number(this.config, 'STATS_EMAIL_DAILY_LIMIT', 100),
      emailMonthly: number(this.config, 'STATS_EMAIL_MONTHLY_LIMIT', 3000),
      // Google Maps Platform: 10 000 darmowych wczytań mapy (Dynamic Maps) miesięcznie, potem ok. 7 USD / 1000
      mapsMonthlyFree: number(this.config, 'STATS_MAPS_MONTHLY_FREE', 10000),
      mapsPricePer1000Usd: number(this.config, 'STATS_MAPS_PRICE_USD', 7),
      usdPln: number(this.config, 'STATS_USD_PLN', 3.9),
    };
  }

  /** Zestawienie dla panelu: dziś, bieżący miesiąc, ostatnie `days` dni, podział wg kluczy, rezerwacje */
  async summary(days = 30) {
    const { date: today } = warsawNow();
    const monthStart = `${today.slice(0, 8)}01`;
    const from = shiftDate(today, -(days - 1));
    const since = from < monthStart ? from : monthStart;

    const rows = await this.prisma.dailyStat.findMany({
      where: { date: { gte: since } },
    });
    const sum = (metric: Metric, test: (date: string) => boolean) =>
      rows
        .filter((r) => r.metric === metric && test(r.date))
        .reduce((s, r) => s + r.count, 0);
    const byKey = (metric: Metric, test: (date: string) => boolean) => {
      const map = new Map<string, number>();
      for (const r of rows)
        if (r.metric === metric && test(r.date))
          map.set(r.key, (map.get(r.key) ?? 0) + r.count);
      return [...map.entries()]
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count);
    };
    const isToday = (d: string) => d === today;
    const inMonth = (d: string) => d >= monthStart;
    const inRange = (d: string) => d >= from;

    // tempo z bieżącego miesiąca → prognoza na koniec miesiąca (do porównania z limitem)
    const dayOfMonth = Number(today.slice(8, 10));
    const daysInMonth = new Date(
      Date.UTC(Number(today.slice(0, 4)), Number(today.slice(5, 7)), 0),
    ).getUTCDate();
    const forecast = (value: number) =>
      Math.round((value / dayOfMonth) * daysInMonth);

    const limits = this.limits();
    const mapsMonth = sum('map', inMonth);
    const mapsCostPln =
      (Math.max(0, forecast(mapsMonth) - limits.mapsMonthlyFree) / 1000) *
      limits.mapsPricePer1000Usd *
      limits.usdPln;

    const series = Array.from({ length: days }, (_, i) => {
      const date = shiftDate(from, i);
      const on = (d: string) => d === date;
      return {
        date,
        views: sum('view', on),
        maps: sum('map', on),
        mails: sum('mail', on),
      };
    });

    return {
      today,
      limits,
      month: {
        start: monthStart,
        dayOfMonth,
        daysInMonth,
        views: sum('view', inMonth),
        maps: mapsMonth,
        mails: sum('mail', inMonth),
        mailsFailed: sum('mail_failed', inMonth),
        forecast: {
          views: forecast(sum('view', inMonth)),
          maps: forecast(mapsMonth),
          mails: forecast(sum('mail', inMonth)),
        },
        mapsCostPln: Math.round(mapsCostPln * 100) / 100,
      },
      todayTotals: {
        views: sum('view', isToday),
        maps: sum('map', isToday),
        mails: sum('mail', isToday),
        mailsFailed: sum('mail_failed', isToday),
      },
      series,
      pages: byKey('view', inRange),
      sources: byKey('source', inRange),
      products: await this.topProducts(byKey('product', inRange)),
      mapsBySource: byKey('map', inMonth),
      mailsByCategory: byKey('mail', inMonth),
      reservations: await this.reservations(from),
    };
  }

  /** Najczęściej oglądane produkty: liczniki z nazwami (produkty usunięte z oferty – pominięte) */
  private async topProducts(counts: { key: string; count: number }[]) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: counts.map((c) => c.key) } },
      select: { id: true, name: true, isActive: true },
    });
    const byId = new Map(products.map((p) => [p.id, p]));
    return counts
      .filter((c) => byId.has(c.key))
      .slice(0, 10)
      .map((c) => ({
        id: c.key,
        name: byId.get(c.key)!.name,
        active: byId.get(c.key)!.isActive,
        count: c.count,
      }));
  }

  /** Rezerwacje złożone w okresie (bez danych osobowych): liczba, anulowane, kwota, punkty, produkty */
  private async reservations(from: string) {
    const since = new Date(`${from}T00:00:00+02:00`);
    const list = await this.prisma.reservation.findMany({
      where: { createdAt: { gte: since } },
      select: {
        status: true,
        pickupType: true,
        total: true,
        items: { select: { productName: true, quantity: true } },
      },
    });
    const active = list.filter((r) => r.status !== 'CANCELLED');
    const products = new Map<string, number>();
    for (const r of active)
      for (const i of r.items)
        products.set(
          i.productName,
          (products.get(i.productName) ?? 0) + i.quantity,
        );
    return {
      count: list.length,
      cancelled: list.length - active.length,
      total:
        Math.round(active.reduce((s, r) => s + Number(r.total), 0) * 100) / 100,
      store: active.filter((r) => r.pickupType === 'STORE').length,
      van: active.filter((r) => r.pickupType === 'VAN').length,
      topProducts: [...products.entries()]
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5),
    };
  }
}
