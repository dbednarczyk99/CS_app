/**
 * Adresy na stronie (slugi): „Chleb żytni razowy” → „chleb-zytni-razowy”. Polskie litery bez ogonków,
 * wszystko poza literami i cyframi → myślnik. Używane dla produktów, wpisów i etykiet.
 */
export const slugify = (text: string, maxLength = 60, fallback = 'strona') =>
  text
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '') || fallback;

/** Wolny slug: „jagodzianka”, a gdy zajęty – „jagodzianka-2”, „jagodzianka-3”… */
export async function uniqueSlug(
  base: string,
  isTaken: (slug: string) => Promise<boolean>,
) {
  let slug = base;
  for (let i = 2; await isTaken(slug); i++) slug = `${base}-${i}`;
  return slug;
}
