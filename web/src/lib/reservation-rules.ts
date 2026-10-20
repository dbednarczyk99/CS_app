import { api, orFallback, type ReservationRules } from './api';

/** Zasady sprzed panelu – gdy API nie odpowiada */
export const DEFAULT_RULES: ReservationRules = { cutoffTime: '18:00', maxDaysAhead: 5, maxActivePerPhone: 3 };

/** Zasady rezerwacji z panelu (Ustawienia → Zasady rezerwacji) – do tekstów na stronie */
export const getReservationRules = () => orFallback(api.reservationRules(), DEFAULT_RULES);
