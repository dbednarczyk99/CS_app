import { warsawNow } from '../reservations/reservation-rules';

type PromoFields = {
  price: number;
  isPromo: boolean;
  promoPrice: number | null;
  promoFrom: string | null;
  promoTo: string | null;
};

/** Promocja trwa w danym dniu (YYYY-MM-DD, czas polski): włączona i dzień mieści się w okresie od–do */
export const isPromoActive = (p: PromoFields, date = warsawNow().date) =>
  p.isPromo &&
  (!p.promoFrom || p.promoFrom <= date) &&
  (!p.promoTo || date <= p.promoTo);

/** Cena do zapłaty w danym dniu: promocyjna, gdy promocja trwa i ma niższą cenę */
export const currentPrice = (p: PromoFields, date = warsawNow().date) =>
  isPromoActive(p, date) && p.promoPrice != null && p.promoPrice < p.price
    ? p.promoPrice
    : p.price;

/** Dla strony: czy promocja trwa dziś i aktualna cena – strona nie musi sama liczyć dat */
export const withPromo = <T extends PromoFields>(p: T) => ({
  ...p,
  promoActive: isPromoActive(p),
  currentPrice: currentPrice(p),
});

/** Etykieta widoczna w danym dniu: bez dat albo dzień mieści się w okresie od–do (włącznie) */
export const isLabelActive = (
  l: { activeFrom: string | null; activeTo: string | null },
  date = warsawNow().date,
) =>
  (!l.activeFrom || l.activeFrom <= date) &&
  (!l.activeTo || date <= l.activeTo);
