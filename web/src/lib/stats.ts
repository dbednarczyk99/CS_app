/**
 * Anonimowe statystyki: odsłony podstron i wczytania mapy Google (licznik kosztów w panelu).
 * Bez cookies i identyfikatorów – serwer zapisuje tylko liczbę zdarzeń danego dnia.
 */
export function trackEvent(type: 'view' | 'map' | 'source', key: string) {
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

/**
 * Źródło wejścia: znacznik ?utm_source=… w linku (np. w newsletterze, w bio na Instagramie) albo strona,
 * z której przyszedł odwiedzający (tylko kategoria). null = przejście w obrębie naszej strony.
 */
export function trafficSource(): string | null {
  const utm = new URLSearchParams(window.location.search).get('utm_source')?.toLowerCase();
  if (utm) {
    if (['newsletter', 'email', 'mail'].includes(utm)) return 'newsletter';
    if (['instagram', 'ig'].includes(utm)) return 'instagram';
    if (['facebook', 'fb'].includes(utm)) return 'facebook';
    if (utm === 'tiktok') return 'tiktok';
    if (utm === 'google') return 'google';
    return 'inne-strony';
  }
  if (!document.referrer) return 'bezposrednio';
  let host: string;
  try {
    host = new URL(document.referrer).hostname.replace(/^www./, '');
  } catch {
    return 'bezposrednio';
  }
  if (host === window.location.hostname) return null;
  if (/(^|.)google./.test(host)) return 'google';
  if (/(^|.)(bing.com|duckduckgo.com|yahoo.|ecosia.org|yandex.|search.brave.com|onet.pl|wp.pl|interia.pl)/.test(host)) return 'inne-wyszukiwarki';
  if (/(^|.)instagram.com$/.test(host)) return 'instagram';
  if (/(^|.)(facebook.com|fb.com|messenger.com)$/.test(host)) return 'facebook';
  if (/(^|.)tiktok.com$/.test(host)) return 'tiktok';
  return 'inne-strony';
}
