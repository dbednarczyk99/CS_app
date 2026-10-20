/** Zasady rezerwacji ustawiane przez właściciela w panelu (Ustawienia → Zasady rezerwacji) */
export interface ReservationSettings {
  /** rezerwacja i anulowanie do tej godziny dnia poprzedzającego odbiór, „HH:MM” */
  cutoffTime: string;
  /** najdalej tyle dni do przodu */
  maxDaysAhead: number;
  /** najwyżej tyle aktywnych rezerwacji na jeden numer telefonu */
  maxActivePerPhone: number;
  /** codzienne zestawienie „do przygotowania” na jutro – e-mailem */
  summaryEnabled: boolean;
  /** godzina wysyłki zestawienia, „HH:MM” (po zamknięciu listy) */
  summaryTime: string;
  /** adresy odbiorców zestawienia (puste = e-mail z „Dane kontaktowe”) */
  summaryEmails: string[];
}

/** Zasady rezerwacji na stronie (publiczne – bez adresów zestawienia) */
export type PublicReservationRules = Pick<
  ReservationSettings,
  'cutoffTime' | 'maxDaysAhead' | 'maxActivePerPhone'
>;

export const LIMITS = {
  maxDaysAhead: { min: 1, max: 14 },
  maxActivePerPhone: { min: 1, max: 20 },
  summaryEmails: 5,
};

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
};

/** Wartości z panelu → oczyszczone ustawienia albo lista błędów po polsku */
export function validateReservationSettings(input: unknown): {
  value: ReservationSettings;
  errors: string[];
} {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<
    string,
    unknown
  >;
  const errors: string[] = [];
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const int = (v: unknown) =>
    typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;

  const cutoffTime = str(raw.cutoffTime);
  if (!TIME.test(cutoffTime))
    errors.push('Godzina zamknięcia rezerwacji: podaj godzinę, np. 18:00');

  const maxDaysAhead = int(raw.maxDaysAhead);
  const days = LIMITS.maxDaysAhead;
  if (
    !Number.isInteger(maxDaysAhead) ||
    maxDaysAhead < days.min ||
    maxDaysAhead > days.max
  )
    errors.push(`Ile dni do przodu: liczba od ${days.min} do ${days.max}`);

  const maxActivePerPhone = int(raw.maxActivePerPhone);
  const phone = LIMITS.maxActivePerPhone;
  if (
    !Number.isInteger(maxActivePerPhone) ||
    maxActivePerPhone < phone.min ||
    maxActivePerPhone > phone.max
  )
    errors.push(
      `Limit rezerwacji na numer telefonu: liczba od ${phone.min} do ${phone.max}`,
    );

  const summaryEnabled = raw.summaryEnabled === true;
  const summaryTime = str(raw.summaryTime);
  if (!TIME.test(summaryTime))
    errors.push('Godzina zestawienia: podaj godzinę, np. 18:30');
  else if (
    TIME.test(cutoffTime) &&
    toMinutes(summaryTime) <= toMinutes(cutoffTime)
  )
    errors.push(
      'Godzina zestawienia musi być późniejsza niż zamknięcie rezerwacji – inaczej lista na jutro nie będzie jeszcze pełna',
    );

  const emails = (
    Array.isArray(raw.summaryEmails)
      ? raw.summaryEmails
      : str(raw.summaryEmails).split(/[\s,;]+/)
  )
    .map(str)
    .filter(Boolean);
  const unique = [...new Set(emails.map((e) => e.toLowerCase()))];
  const invalid = unique.filter((e) => !EMAIL.test(e) || e.length > 120);
  if (invalid.length)
    errors.push(`Niepoprawny adres e-mail: ${invalid.join(', ')}`);
  if (unique.length > LIMITS.summaryEmails)
    errors.push(`Zestawienie: najwyżej ${LIMITS.summaryEmails} adresów e-mail`);

  return {
    value: {
      cutoffTime,
      maxDaysAhead,
      maxActivePerPhone,
      summaryEnabled,
      summaryTime,
      summaryEmails: unique,
    },
    errors,
  };
}
