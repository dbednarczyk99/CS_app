export type ReservationStatus = 'NEW' | 'READY' | 'PICKED_UP' | 'NO_SHOW' | 'CANCELLED';

export const STATUS: Record<
  ReservationStatus,
  { label: string; color: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }
> = {
  NEW: { label: 'Przyjęta', color: 'info' },
  READY: { label: 'Gotowa do odbioru', color: 'primary' },
  PICKED_UP: { label: 'Odebrana', color: 'success' },
  NO_SHOW: { label: 'Nieodebrana', color: 'warning' },
  CANCELLED: { label: 'Anulowana', color: 'default' },
};

export const statusChoices = Object.entries(STATUS).map(([id, { label }]) => ({ id, name: label }));

export const money = (value: string | number) =>
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(Number(value));

/** YYYY-MM-DD (czas polski) → „sob., 17 października” */
export const formatDay = (date: string) =>
  new Intl.DateTimeFormat('pl-PL', { weekday: 'short', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    new Date(`${date}T12:00:00Z`),
  );

export const formatPhone = (phone: string) => {
  const d = phone.replace('+48', '');
  return d.length === 9 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : phone;
};
