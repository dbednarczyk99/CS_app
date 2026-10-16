import type { OpeningHours, Weekday } from './api';

const priceFormat = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
export const formatPrice = (value: number) => priceFormat.format(value);

const dateFormat = new Intl.DateTimeFormat('pl-PL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
export const formatDate = (iso: string) => dateFormat.format(new Date(iso));

export const WEEKDAYS: { key: Weekday; label: string; short: string }[] = [
  { key: 'MONDAY', label: 'Poniedziałek', short: 'Pn' },
  { key: 'TUESDAY', label: 'Wtorek', short: 'Wt' },
  { key: 'WEDNESDAY', label: 'Środa', short: 'Śr' },
  { key: 'THURSDAY', label: 'Czwartek', short: 'Cz' },
  { key: 'FRIDAY', label: 'Piątek', short: 'Pt' },
  { key: 'SATURDAY', label: 'Sobota', short: 'Sb' },
  { key: 'SUNDAY', label: 'Niedziela', short: 'Nd' },
];

// Date.getDay(): 0 = niedziela
export function weekdayOf(date: Date): Weekday {
  return WEEKDAYS[(date.getDay() + 6) % 7].key;
}

/** Godziny otwarcia w danym dniu jako [od, do] ("06:30") albo null, gdy nieczynne */
export function hoursFor(hours: OpeningHours | null, day: Weekday): [string, string] | null {
  const value = hours?.[day.toLowerCase()] ?? hours?.[day];
  if (!value) return null;
  // z panelu: puste pola = nieczynne
  if (typeof value !== 'string') return value.openFrom && value.openTo ? [value.openFrom, value.openTo] : null;
  const [from, to] = value.split(/[–-]/).map((v) => v.trim());
  return from && to ? [from, to] : null;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/** Polska odmiana: plural(4, ['piekarnia', 'piekarnie', 'piekarni']) → 'piekarnie' */
export function plural(n: number, [one, few, many]: [string, string, string]) {
  if (n === 1) return one;
  const last = n % 10;
  const lastTwo = n % 100;
  return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? few : many;
}

/** Data odbioru (YYYY-MM-DD, czas polski) jako „sobota, 17 października” */
export function formatDay(date: string, style: 'long' | 'short' = 'long') {
  return new Intl.DateTimeFormat(
    'pl-PL',
    style === 'long'
      ? { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }
      : { weekday: 'short', day: 'numeric', month: 'numeric', timeZone: 'UTC' },
  ).format(new Date(`${date}T12:00:00Z`));
}
