/**
 * Anonimowe statystyki: odsłony podstron i wczytania mapy Google (licznik kosztów w panelu).
 * Bez cookies i identyfikatorów – serwer zapisuje tylko liczbę zdarzeń danego dnia.
 */
export function trackEvent(type: 'view' | 'map', key: string) {
  try {
    fetch('/api/statystyki', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, key }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // statystyki nigdy nie przeszkadzają w korzystaniu ze strony
  }
}

/** Ścieżka podstrony sprowadzona do wzorca (bez identyfikatorów produktów, wpisów, tokenów) */
export function pageKey(pathname: string): string {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (/^\/oferta\/[^/]+$/.test(path)) return '/oferta/[produkt]';
  if (/^\/aktualnosci\/[^/]+$/.test(path)) return '/aktualnosci/[wpis]';
  if (path.startsWith('/rezerwacja/anuluj')) return '/rezerwacja/anuluj';
  if (path.startsWith('/newsletter')) return '/newsletter';
  const known = ['/', '/oferta', '/piekarnie', '/chlebowoz', '/o-nas', '/aktualnosci', '/kontakt', '/rezerwacja', '/regulamin', '/polityka-prywatnosci'];
  return known.includes(path) ? path : '(inne)';
}
