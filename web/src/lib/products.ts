import type { LabelColor, Product } from './api';

/** Produkt można teraz kupić/zarezerwować: aktywny, a sezonowy – w sezonie */
export const isAvailable = (p: Product) => p.isActive && (!p.isSeasonal || p.inSeason);

/** Sezonowy poza sezonem – widoczny na stronie, ale wyciszony, bez ceny i rezerwacji */
export const isOutOfSeason = (p: Product) => p.isActive && p.isSeasonal && !p.inSeason;

/** Promocja trwa dziś (okres od–do sprawdza API) */
export const isOnPromo = (p: Product) => p.promoActive === true;

/** Cena do zapłaty dziś – promocyjna, gdy promocja trwa i ma niższą cenę */
export const priceOf = (p: Product) => p.currentPrice ?? p.price;

/** Cena przed promocją do przekreślenia – tylko gdy promocja obniża cenę */
export const oldPriceOf = (p: Product) => (priceOf(p) < p.price ? p.price : null);

export type LabelFilter = { key: string; label: string; test: (p: Product) => boolean };

/**
 * Filtry etykiet w ofercie (?etykiety=promocje,nowosci): „Promocje”, etykiety z panelu (w kolejności z panelu)
 * i „Sezonowe”. Kilka zaznaczonych = dowolna z nich. Etykiety bierzemy z produktów – nowa etykieta z panelu
 * pojawia się w filtrach sama, gdy ma przypisany produkt.
 */
export function labelFilters(products: Product[]): LabelFilter[] {
  const labels = [...new Map(products.flatMap((p) => p.labels ?? []).map((l) => [l.id, l])).values()].sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name, 'pl'),
  );
  return [
    { key: 'promocje', label: 'Promocje', test: isOnPromo },
    ...labels.map((l) => ({
      key: l.slug,
      label: l.name,
      test: (p: Product) => (p.labels ?? []).some((pl) => pl.id === l.id),
    })),
    { key: 'sezonowe', label: 'Sezonowe', test: (p: Product) => p.isSeasonal },
  ];
}

/** Produkt z dowolną etykietą (promocja, etykieta z panelu, Teraz dostępne) */
export const hasBadge = (p: Product) => isOnPromo(p) || (p.labels ?? []).length > 0 || p.isSeasonal;

/**
 * Produkty do karuzeli „Wypieki, po które się wraca”: wszystkie dostępne z etykietą (promocje, etykiety z panelu,
 * sezonowe), a gdy jest ich mniej niż `min` – dopełnienie losowymi z różnych kategorii (na zmianę).
 * Losowanie po stronie serwera, więc zestaw zmienia się przy odświeżeniu strony (ISR).
 */
export function featuredProducts(available: Product[], min = 8): Product[] {
  // najpierw promocje, potem wg pierwszej etykiety (kolejność z panelu), na końcu sezonowe
  const rank = (p: Product) =>
    isOnPromo(p) ? -1 : Math.min(...(p.labels ?? []).map((l) => l.order), Number.MAX_SAFE_INTEGER);
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

/** Wygląd etykiety: kolory z panelu + stałe: promocja, sezonowe, poza sezonem */
export type BadgeTone = LabelColor | 'promo' | 'season' | 'off';

/** Etykiety produktu w kolejności wyświetlania; poza sezonem tylko „Poza sezonem” */
export function productBadges(p: Product): { label: string; tone: BadgeTone }[] {
  if (isOutOfSeason(p)) return [{ label: 'Poza sezonem', tone: 'off' }];
  const badges: { label: string; tone: BadgeTone }[] = [];
  if (isOnPromo(p)) badges.push({ label: 'Promocja', tone: 'promo' });
  for (const l of p.labels ?? []) badges.push({ label: l.name, tone: l.color });
  if (p.isSeasonal) badges.push({ label: 'Teraz dostępne', tone: 'season' });
  return badges;
}

/** Style etykiet: na zdjęciu (karta produktu) i na stronie produktu (z obramowaniem) */
export const BADGE_STYLE: Record<BadgeTone, { card: string; page: string }> = {
  promo: { card: 'bg-brick text-cream', page: 'border-brick bg-brick text-cream' },
  gold: { card: 'bg-gold text-ink', page: 'border-gold bg-gold text-ink' },
  cream: { card: 'bg-cream text-ink', page: 'border-cream bg-cream text-ink' },
  dark: { card: 'bg-ink/85 text-cream backdrop-blur-sm', page: 'border-cream/40 text-cream' },
  green: { card: 'bg-olive text-cream', page: 'border-olive bg-olive text-cream' },
  season: { card: 'bg-ink/80 text-gold backdrop-blur-sm', page: 'border-gold/50 text-gold' },
  off: { card: 'bg-ink/80 text-stone backdrop-blur-sm', page: 'border-line text-stone' },
};
