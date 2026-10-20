/** Zakładka ekranu: etykieta, adres i (opcjonalnie) początek adresów, przy których jest aktywna */
export type ScreenTab = { label: string; to: string; match?: string };

/** Oferta → „Kategorie i etykiety” */
export const OFFER_TABS: ScreenTab[] = [
  { label: 'Kategorie', to: '/products/categories' },
  { label: 'Etykiety', to: '/products/labels' },
];

/** Strona → „Strona główna”: sekcje i karuzela */
export const HOME_TABS: ScreenTab[] = [
  { label: 'Sekcje', to: '/strona/glowna' },
  { label: 'Karuzela', to: '/content/hero-slides' },
];

/** Piekarnie i kontakt → „Kontakt” */
export const CONTACT_TABS: ScreenTab[] = [
  { label: 'Dane kontaktowe', to: '/contact/info' },
  { label: 'Media społecznościowe', to: '/contact/media' },
];

/** Adresy, przy których pozycja menu ma być podświetlona (wszystkie zakładki jej ekranu) */
export const isTabActive = (tabs: ScreenTab[], pathname: string) =>
  tabs.some((t) => pathname.startsWith(t.match ?? t.to));
