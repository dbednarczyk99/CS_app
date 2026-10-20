import type { ReservationRules } from './api';
import { plural } from './format';

/**
 * Lekkie funkcje tekstowe – bezpieczne także w komponentach klienckich (bez treści domyślnych i kodu API).
 */

/** Wstawia wartości w miejsce znaczników, np. fill('W {miejsca}', { miejsca: '4 miejscach' }) */
export const fill = (text: string, values: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (match, name: string) => values[name] ?? match);

/**
 * Wartości znaczników zasad rezerwacji w tekstach z panelu (formularz, strona produktu, regulamin):
 * {godzina} → „18:00”, {dni} → „5 dni” / „1 dzień”, {limit} → „3”.
 */
export const ruleTokens = (rules: ReservationRules) => ({
  godzina: rules.cutoffTime,
  dni: `${rules.maxDaysAhead} ${plural(rules.maxDaysAhead, ['dzień', 'dni', 'dni'])}`,
  limit: String(rules.maxActivePerPhone),
});
