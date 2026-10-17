import type { Product } from './api';

/** Produkt można teraz kupić/zarezerwować: aktywny, a sezonowy – w sezonie */
export const isAvailable = (p: Product) => p.isActive && (!p.isSeasonal || p.inSeason);

/** Sezonowy poza sezonem – widoczny na stronie, ale wyciszony, bez ceny i rezerwacji */
export const isOutOfSeason = (p: Product) => p.isActive && p.isSeasonal && !p.inSeason;

export type BadgeTone = 'new' | 'bestseller' | 'season' | 'off';

/** Etykiety produktu w kolejności wyświetlania; poza sezonem tylko „Poza sezonem” */
export function productBadges(p: Product): { label: string; tone: BadgeTone }[] {
  if (isOutOfSeason(p)) return [{ label: 'Poza sezonem', tone: 'off' }];
  const badges: { label: string; tone: BadgeTone }[] = [];
  if (p.isNew) badges.push({ label: 'Nowość', tone: 'new' });
  if (p.isBestseller) badges.push({ label: 'Bestseller', tone: 'bestseller' });
  if (p.isSeasonal) badges.push({ label: 'Teraz dostępne', tone: 'season' });
  return badges;
}
