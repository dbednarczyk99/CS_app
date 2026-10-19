import type { LabelColor, Product, ProductLabel } from './api';

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

/** Promocja obniżająca cenę – do przeliczenia ceny na dzień odbioru rezerwacji */
export type PromoWindow = { price: number; from: string | null; to: string | null };

export const promoWindow = (p: Product): PromoWindow | null =>
  p.isPromo && p.promoPrice != null && p.promoPrice < p.price
    ? { price: p.promoPrice, from: p.promoFrom, to: p.promoTo }
    : null;

/** Dzień (YYYY-MM-DD) mieści się w okresie promocji (daty włącznie, puste = bez ograniczenia) */
export const inPromoWindow = (w: PromoWindow, date: string) => (!w.from || w.from <= date) && (!w.to || date <= w.to);

/**
 * Cena przy odbiorze w danym dniu – tak samo liczy ją API przy rezerwacji: promocyjna tylko wtedy,
 * gdy dzień odbioru mieści się w okresie promocji.
 */
export const priceOn = (item: { price: number; promo?: PromoWindow | null }, date: string) =>
  item.promo && inPromoWindow(item.promo, date) ? item.promo.price : item.price;

export type LabelFilter ={ key: string; label: string; test: (p: Product) => boolean };

const byOrder = (a: ProductLabel, b: ProductLabel) => a.order - b.order || a.name.localeCompare(b.name, 'pl');

// etykieta „Promocja”, gdy API jej nie podało (np. starsza odpowiedź) – nazwę, kolor i kolejność zmienia się w panelu
const DEFAULT_PROMO_LABEL: ProductLabel = { id: 'promo', name: 'Promocja', slug: 'promocje', color: 'red', order: 0 };

/** Etykiety produktu w kolejności z panelu – z etykietą „Promocja”, gdy promocja trwa */
export const labelsOf = (p: Product): ProductLabel[] =>
  [...(p.labels ?? []), ...(isOnPromo(p) ? [p.promoLabel ?? DEFAULT_PROMO_LABEL] : [])].sort(byOrder);

/**
 * Filtry etykiet w ofercie (?etykiety=promocje,nowosci): etykiety z panelu razem z „Promocją” (w kolejności
 * z panelu) i „Sezonowe”. Kilka zaznaczonych = dowolna z nich. Etykiety bierzemy z produktów – nowa etykieta
 * z panelu pojawia się w filtrach sama, gdy ma przypisany produkt.
 */
export function labelFilters(products: Product[]): LabelFilter[] {
  const promo = products.find((p) => p.promoLabel)?.promoLabel ?? DEFAULT_PROMO_LABEL;
  const labels = [
    ...new Map([...products.flatMap((p) => p.labels ?? []), promo].map((l) => [l.id, l])).values(),
  ].sort(byOrder);
  return [
    ...labels.map((l) => ({
      key: l.slug,
      label: l.name,
      test: l.id === promo.id ? isOnPromo : (p: Product) => (p.labels ?? []).some((pl) => pl.id === l.id),
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
  // wg pierwszej etykiety (kolejność z panelu, z „Promocją”), na końcu tylko sezonowe
  const rank = (p: Product) => labelsOf(p)[0]?.order ?? Number.MAX_SAFE_INTEGER;
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

/** Wygląd etykiety: kolory z panelu + stałe: sezonowe, poza sezonem */
export type BadgeTone = LabelColor | 'season' | 'off';

/** Etykiety produktu w kolejności wyświetlania; poza sezonem tylko „Poza sezonem” */
export function productBadges(p: Product): { label: string; tone: BadgeTone }[] {
  if (isOutOfSeason(p)) return [{ label: 'Poza sezonem', tone: 'off' }];
  const badges: { label: string; tone: BadgeTone }[] = [];
  for (const l of labelsOf(p)) badges.push({ label: l.name, tone: l.color });
  if (p.isSeasonal) badges.push({ label: 'Teraz dostępne', tone: 'season' });
  return badges;
}

/** Style etykiet: na zdjęciu (karta produktu) i na stronie produktu (z obramowaniem) */
export const BADGE_STYLE: Record<BadgeTone, { card: string; page: string }> = {
  gold: { card: 'bg-gold text-ink', page: 'border-gold bg-gold text-ink' },
  cream: { card: 'bg-cream text-ink', page: 'border-cream bg-cream text-ink' },
  dark: { card: 'bg-ink/85 text-cream backdrop-blur-sm', page: 'border-cream/40 text-cream' },
  green: { card: 'bg-olive text-cream', page: 'border-olive bg-olive text-cream' },
  red: { card: 'bg-brick text-cream', page: 'border-brick bg-brick text-cream' },
  season: { card: 'bg-ink/80 text-gold backdrop-blur-sm', page: 'border-gold/50 text-gold' },
  off: { card: 'bg-ink/80 text-stone backdrop-blur-sm', page: 'border-line text-stone' },
};
