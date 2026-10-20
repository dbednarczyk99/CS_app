/**
 * Ekran nadrzędny – do strzałki „← …” w górnym pasku. Ekrany szczegółów (dodawanie, edycja, podgląd) wracają do
 * swojej listy, np. edycja produktu → „Produkty”. Ekrany główne z menu nie mają nadrzędnego (bez strzałki).
 */
const PARENTS: { resource: string; label: string; to?: string }[] = [
  { resource: 'reservations', label: 'Rezerwacje' },
  { resource: 'products/categories', label: 'Kategorie' },
  { resource: 'products/labels', label: 'Etykiety' },
  { resource: 'products', label: 'Produkty' },
  { resource: 'blog', label: 'Aktualności i newsletter' },
  { resource: 'announcements', label: 'Baner informacyjny' },
  { resource: 'newsletter', label: 'Subskrybenci' },
  { resource: 'content/hero-slides', label: 'Karuzela' },
  { resource: 'contact/locations', label: 'Piekarnie' },
  { resource: 'bread-van/locations', label: 'Chlebowóz – trasa' },
  // opis chlebowozu: edycja → podgląd opisu (sam podgląd to zakładka ekranu „Chlebowóz” – bez nadrzędnego)
  { resource: 'bread-van/description', label: 'Chlebowóz – opis', to: '/bread-van/description/view/show' },
  { resource: 'contact/info', label: 'Dane kontaktowe' },
  { resource: 'contact/media', label: 'Media społecznościowe' },
  { resource: 'users', label: 'Konta' },
];

/** Ekran nadrzędny dla adresu panelu albo null */
export function parentScreen(pathname: string): { to: string; label: string } | null {
  // sama lista (np. /products/categories) – ekran główny, mimo że adres zaczyna się od /products/
  if (PARENTS.some((p) => pathname === `/${p.resource}`)) return null;
  for (const p of PARENTS) {
    const prefix = `/${p.resource}/`;
    if (!pathname.startsWith(prefix)) continue;
    const to = p.to ?? `/${p.resource}`;
    // sam ekran docelowy (np. podgląd opisu chlebowozu) nie ma nadrzędnego
    return pathname === to || pathname.length <= prefix.length ? null : { to, label: p.label };
  }
  return null;
}
