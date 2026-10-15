import { API_BASE_URL } from '@/lib/api';

/** Pośrednik: przeglądarka wysyła rezerwację do strony, strona przekazuje ją do API (bez CORS i bez adresu API w przeglądarce) */
export async function POST(request: Request) {
  const res = await fetch(`${API_BASE_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: await request.text(),
    cache: 'no-store',
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
