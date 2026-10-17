import type { Product } from './api';

/** Produkt można teraz kupić/zarezerwować: aktywny, a sezonowy – w sezonie */
export const isAvailable = (p: Product) => p.isActive && (!p.isSeasonal || p.inSeason);

/** Sezonowy poza sezonem – widoczny na stronie, ale wyciszony, bez ceny i rezerwacji */
export const isOutOfSeason = (p: Product) => p.isActive && p.isSeasonal && !p.inSeason;

/** Filtry etykiet w ofercie (?etykiety=nowosci,bestsellery); kilka zaznaczonych = dowolna z nich */
export const LABEL_FILTERS = [
  { key: 'nowosci', label: 'Nowości', test: (p: Product) => p.isNew },
  { key: 'bestsellery', label: 'Bestsellery', test: (p: Product) => p.isBestseller },
  { key: 'sezonowe', label: 'Sezonowe', test: (p: Product) => p.isSeasonal },
] as const;

export type LabelFilterKey = (typeof LABEL_FILTERS)[number]['key'];

/** Produkt z dowolną etykietą (Bestseller, Nowość, Teraz dostępne) */
export const hasBadge = (p: Product) => p.isBestseller || p.isNew || p.isSeasonal;

/**
 * Produkty do karuzeli „Wypieki, po które się wraca”: wszystkie dostępne z etykietą (bestsellery, nowości,
 * sezonowe), a gdy jest ich mniej niż `min` – dopełnienie losowymi z różnych kategorii (na zmianę).
 * Losowanie po stronie serwera, więc zestaw zmienia się przy odświeżeniu strony (ISR).
 */
export function featuredProducts(available: Product[], min = 8): Product[] {
  const rank = (p: Product) => (p.isBestseller ? 0 : p.isNew ? 1 : 2);
  const labeled = available.filter(hasBadge).sort((a, b) => rank(a) - rank(b));
  if (labeled.length >= min) return labeled;

  // pozostałe: przetasowane w obrębie kategorii, potem po jednym z każdej kategorii na zmianę
  const shuffle = <T,>(list: T[]) => list.map((v) => [Math.random(), v] as const).sort((a, b) => a[0] - b[0]).map(([, v]) => v);
  const byCategory = new Map<string, Product[]>();
  for (const p of available) if (!hasBadge(p)) byCategory.set(p.categoryId, [...(byCategory.get(p.categoryId) ?? []), p]);
  const queues = shuffle([...byCategory.values()].map(shuffle));
  const fill: Product[] = [];
  while (labeled.length + fill.length < min && queues.some((q) => q.length)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next && labeled.length + fill.length < min) fill.push(next);
    }
  }
  return [...labeled, ...fill];
}

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
