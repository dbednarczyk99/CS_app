import { BODY, C, esc, HEADING } from '../reservations/reservation-emails';

/**
 * Kafelek produktu w treści wpisu: osobny akapit „[produkt:<id> Nazwa]” (nazwa tylko dla czytelności w panelu).
 * Strona zamienia go na kafelek (web/src/components/ProductTile.tsx), newsletter – na kafelek w e-mailu.
 */
export const PRODUCT_TOKEN = /\[produkt:([0-9a-f-]{36})[^\]]*\]/gi;

/** Id produktów z treści (kolejność pierwszego wystąpienia, bez powtórzeń) */
export const productIdsIn = (content: string) => [
  ...new Set(
    [...content.matchAll(PRODUCT_TOKEN)].map((m) => m[1].toLowerCase()),
  ),
];

/** Cały akapit to kafelek produktu → id produktu, inaczej null */
export const tileIdOf = (paragraph: string) => {
  const match = /^\s*\[produkt:([0-9a-f-]{36})[^\]]*\]\s*$/i.exec(paragraph);
  return match ? match[1].toLowerCase() : null;
};

export type TileProduct = {
  id: string;
  /** adres produktu na stronie */
  slug: string | null;
  name: string;
  description: string;
  price: number;
  /** cena w dniu wysyłki (promocyjna, gdy promocja trwa) */
  currentPrice: number;
  imageUrl: string | null;
  labels: { name: string; color: string }[];
};

// kolory etykiet jak na stronie (web/src/lib/products.ts – BADGE_STYLE)
const LABEL: Record<string, { bg: string; fg: string; border: string }> = {
  gold: { bg: C.gold, fg: C.ink, border: C.gold },
  cream: { bg: C.cream, fg: C.ink, border: C.cream },
  dark: { bg: C.ink, fg: C.cream, border: '#6b6760' },
  green: { bg: '#556f40', fg: C.cream, border: '#556f40' },
  red: { bg: '#b4473a', fg: C.cream, border: '#b4473a' },
};

const money = (value: number) =>
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(
    value,
  );

/** Kafelek produktu w e-mailu: zdjęcie po lewej, etykiety, nazwa, opis, cena, link do produktu */
export function productTileHtml(p: TileProduct, href: string) {
  const badges = p.labels
    .map((l) => {
      const c = LABEL[l.color] ?? LABEL.gold;
      return `<span style="display:inline-block;margin:0 4px 6px 0;padding:3px 8px;background:${c.bg};border:1px solid ${c.border};color:${c.fg};font-family:${HEADING};font-size:10px;letter-spacing:2px;text-transform:uppercase">${esc(l.name)}</span>`;
    })
    .join('');
  const price =
    p.currentPrice < p.price
      ? `<span style="font-family:${HEADING};font-size:19px;color:${C.gold}">${money(p.currentPrice)}</span>&nbsp;&nbsp;<s style="font-family:${BODY};font-size:13px;color:${C.stone}">${money(p.price)}</s>`
      : `<span style="font-family:${HEADING};font-size:19px;color:${C.gold}">${money(p.price)}</span>`;
  const description =
    p.description.length > 140
      ? `${p.description.slice(0, 137).trimEnd()}…`
      : p.description;
  const image = p.imageUrl
    ? `<td width="150" valign="middle" style="width:150px;padding:0;background:${C.graphite}"><a href="${href}"><img src="${esc(p.imageUrl)}" width="150" alt="${esc(p.name)}" style="display:block;width:150px;height:auto;border:0"></a></td>`
    : '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0;border:1px solid ${C.line};background:${C.coal}"><tr>
${image}
<td valign="top" style="padding:16px 18px">
${badges ? `<div>${badges}</div>` : ''}
<a href="${href}" style="font-family:${HEADING};font-size:17px;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;color:${C.cream}">${esc(p.name)}</a>
<p style="margin:6px 0 0;font-family:${BODY};font-size:13px;line-height:1.55;color:${C.stone}">${esc(description)}</p>
<div style="margin-top:10px">${price}</div>
<a href="${href}" style="display:inline-block;margin-top:10px;font-family:${HEADING};font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;color:${C.gold}">Zobacz produkt &rarr;</a>
</td></tr></table>`;
}

/** Kafelek w wersji tekstowej e-maila */
export const productTileText = (p: TileProduct, href: string) =>
  `${p.name} – ${money(p.currentPrice)}${p.currentPrice < p.price ? ` (zamiast ${money(p.price)})` : ''}: ${href}`;
