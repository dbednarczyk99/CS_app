/**
 * Wyłączniki kosztów (panel: Ustawienia → Usługi i koszty, tylko administrator): każdą płatną usługę można
 * wyłączyć ręcznie, a twardy limit dzienny wyłącza ją sam do północy (czas polski).
 * - emails – wszystkie e-maile (rezerwacje, newsletter, formularz kontaktowy, zestawienie),
 * - maps – interaktywna Mapa Google na stronie (zamiast niej lista z linkami do Map Google),
 * - ratings – odświeżanie ocen Google (Places API) – strona pokazuje ostatnie zapisane oceny.
 */
export type ServiceKey = 'emails' | 'maps' | 'ratings';

export interface ServiceSettings {
  emailsEnabled: boolean;
  mapsEnabled: boolean;
  ratingsEnabled: boolean;
  /** najwyżej tyle e-maili dziennie (plan dostawcy: zwykle 100) */
  emailDailyLimit: number;
  /** najwyżej tyle wczytań mapy dziennie (darmowa pula 10 000/mies. ≈ 320 dziennie) */
  mapsDailyLimit: number;
  /** najwyżej tyle zapytań o oceny Google dziennie */
  ratingsDailyLimit: number;
}

export const SERVICE_LIMITS = {
  emailDailyLimit: { min: 1, max: 10_000 },
  mapsDailyLimit: { min: 1, max: 100_000 },
  ratingsDailyLimit: { min: 1, max: 1_000 },
};

/** Metryka licznika dziennego (DailyStat) dla każdej usługi */
export const SERVICE_METRIC: Record<ServiceKey, string> = {
  emails: 'mail',
  maps: 'map',
  ratings: 'places',
};

export function validateServiceSettings(input: unknown): {
  value: ServiceSettings;
  errors: string[];
} {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<
    string,
    unknown
  >;
  const errors: string[] = [];
  const int = (name: keyof typeof SERVICE_LIMITS, label: string) => {
    const v = raw[name];
    const n =
      typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
    const { min, max } = SERVICE_LIMITS[name];
    if (!Number.isInteger(n) || n < min || n > max)
      errors.push(`${label}: liczba od ${min} do ${max}`);
    return n;
  };
  return {
    value: {
      emailsEnabled: raw.emailsEnabled === true,
      mapsEnabled: raw.mapsEnabled === true,
      ratingsEnabled: raw.ratingsEnabled === true,
      emailDailyLimit: int('emailDailyLimit', 'Limit e-maili dziennie'),
      mapsDailyLimit: int('mapsDailyLimit', 'Limit wczytań mapy dziennie'),
      ratingsDailyLimit: int(
        'ratingsDailyLimit',
        'Limit zapytań o oceny dziennie',
      ),
    },
    errors,
  };
}
