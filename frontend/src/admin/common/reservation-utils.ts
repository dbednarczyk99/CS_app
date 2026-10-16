// tylko do informacji – status zmienia wyłącznie klient (anulowanie linkiem z e-maila)
export type ReservationStatus = 'NEW' | 'CANCELLED';

export const STATUS: Record<
  ReservationStatus,
  { label: string; color: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' }
> = {
  NEW: { label: 'Rezerwacja przyjęta', color: 'success' },
  CANCELLED: { label: 'Rezerwacja anulowana', color: 'default' },
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
