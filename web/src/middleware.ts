import { NextResponse, type NextRequest } from 'next/server';
import { API_BASE_URL as API_URL } from '@/lib/api';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Stare adresy z identyfikatorem (/oferta/<id>, /aktualnosci/<id> – np. w wysłanych newsletterach, zapisanych
 * zakładkach, wynikach Google) → trwałe przekierowanie na czytelny adres (/oferta/jagodzianka) z zachowaniem
 * parametrów (?utm_source=newsletter… – statystyki). Strony produktów i wpisów zostają generowane z wyprzedzeniem.
 */
export async function middleware(request: NextRequest) {
  const match = /^\/(oferta|aktualnosci)\/([^/]+)\/?$/.exec(request.nextUrl.pathname);
  if (!match || !UUID.test(match[2])) return NextResponse.next();

  const [, section, id] = match;
  const endpoint = section === 'oferta' ? `/products/${id}` : `/blog/${id}`;
  try {
    const res = await fetch(`${API_URL}${endpoint}`, { next: { revalidate: 300 } });
    const record = (await res.json().catch(() => null)) as { slug?: string | null } | null;
    if (record?.slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/${section}/${record.slug}`;
      return NextResponse.redirect(url, 308);
    }
  } catch {
    // API niedostępne – strona obsłuży adres z id sama (produkt i wpis da się otworzyć także po id)
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/oferta/:id', '/aktualnosci/:id'],
  runtime: 'nodejs',
};
