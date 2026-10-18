import { Weekday } from '@prisma/client';

/** Zasady rezerwacji (docs/ZALOZENIA.md) */
export const CUTOFF_HOUR = 18; // rezerwacja i anulowanie do 18:00 dnia poprzedzającego odbiór
export const MAX_DAYS_AHEAD = 5; // najdalej 5 dni do przodu
export const MAX_ACTIVE_PER_PHONE = 3;
export const DEFAULT_STORE_HOURS: [string, string] = ['07:00', '18:00'];
const SLOT_MINUTES = 30;
const VAN_SLOT_MINUTES = 15; // postoje chlebowozu są krótkie – gęstsze terminy

const TIME_ZONE = 'Europe/Warsaw';
const WEEKDAYS: Weekday[] = [
  Weekday.SUNDAY,
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
  Weekday.SATURDAY,
];

/** Bieżąca data (YYYY-MM-DD) i godzina w Polsce – niezależnie od strefy serwera */
export function warsawNow(now = new Date()): {
  date: string;
  hour: number;
  minute: number;
} {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function weekdayOf(date: string): Weekday {
  return WEEKDAYS[new Date(`${date}T12:00:00Z`).getUTCDay()];
}

export function isValidDateString(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T12:00:00Z`))
  );
}

/** Daty odbioru, na które można teraz rezerwować */
export function allowedPickupDates(now = new Date()): string[] {
  const { date: today, hour } = warsawNow(now);
  const first = hour < CUTOFF_HOUR ? 1 : 2;
  const dates: string[] = [];
  for (let i = first; i <= MAX_DAYS_AHEAD; i++) dates.push(addDays(today, i));
  return dates;
}

/** Czy rezerwację na dany dzień można jeszcze anulować (do 18:00 dnia poprzedniego) */
export function canCancel(pickupDate: string, now = new Date()): boolean {
  const { date: today, hour } = warsawNow(now);
  const dayBefore = addDays(pickupDate, -1);
  return today < dayBefore || (today === dayBefore && hour < CUTOFF_HOUR);
}

/** Termin anulowania, np. „środa 21.10, 18:00” – do treści maili i strony */
export function cancelDeadline(pickupDate: string): {
  date: string;
  hour: string;
} {
  return { date: addDays(pickupDate, -1), hour: `${CUTOFF_HOUR}:00` };
}

type OpeningHours = Record<
  string,
  string | { openFrom: string; openTo: string }
> | null;

/** Godziny otwarcia sklepu w danym dniu; null = nieczynne. Bez zdefiniowanych godzin – domyślne. */
export function storeHoursOn(
  hours: OpeningHours,
  date: string,
): [string, string] | null {
  if (!hours || Object.keys(hours).length === 0) return DEFAULT_STORE_HOURS;
  const day = weekdayOf(date);
  const value = hours[day.toLowerCase()] ?? hours[day];
  if (!value) return null;
  if (typeof value !== 'string')
    return value.openFrom && value.openTo
      ? [value.openFrom, value.openTo]
      : null;
  const [from, to] = value.split(/[–-]/).map((v) => v.trim());
  return from && to ? [from, to] : null;
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
};
const toHHMM = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

/** Godziny odbioru co 30 min w godzinach otwarcia (ostatnia 30 min przed zamknięciem) */
export function pickupSlots(
  [from, to]: [string, string],
  step = SLOT_MINUTES,
): string[] {
  const slots: string[] = [];
  for (let m = toMinutes(from); m <= toMinutes(to) - step; m += step)
    slots.push(toHHMM(m));
  return slots;
}

/** Szacowana godzina przyjścia do chlebowozu: co 15 min w czasie postoju (bardzo krótki postój = sam początek) */
export function vanPickupSlots(from: string, to: string): string[] {
  const slots = pickupSlots([from, to], VAN_SLOT_MINUTES);
  return slots.length ? slots : [toHHMM(toMinutes(from))];
}

/** Numer telefonu w formacie +48XXXXXXXXX (polskie numery) lub null, gdy niepoprawny */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, '');
  const local = digits.replace(/^(\+48|0048)/, '');
  return /^\d{9}$/.test(local) ? `+48${local}` : null;
}

export function formatPhone(normalized: string): string {
  const d = normalized.replace('+48', '');
  return `+48 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

/** Kod punktu z adresu, gdy nie ustawiono go w panelu: „ul. Józefa Chełmońskiego 116, …” → CHE */
export function codeFromAddress(address: string): string {
  const street = address
    .split(',')[0]
    .replace(/^\s*(ul\.|al\.|pl\.|os\.)\s*/i, '');
  const words = street
    .split(/\s+/)
    .filter((w) => /\p{L}/u.test(w) && !/\d/.test(w));
  const name = (words.at(-1) ?? 'PKT')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/ł/gi, 'L');
  return (
    name
      .replace(/[^A-Za-z]/g, '')
      .slice(0, 3)
      .toUpperCase() || 'PKT'
  );
}

export const VAN_CODE = 'BUS';

/** Początek numeru rezerwacji: KOD-RRMMDD- (np. WIL-261017-) – z rokiem, więc unikalny także między latami */
export function numberPrefix(code: string, pickupDate: string): string {
  return `${code}-${pickupDate.slice(2, 4)}${pickupDate.slice(5, 7)}${pickupDate.slice(8, 10)}-`;
}
