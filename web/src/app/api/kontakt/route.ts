import { API_BASE_URL } from '@/lib/api';
import { clientHeaders } from '@/lib/proxy';

/** Pośrednik formularza kontaktowego: przeglądarka → strona → API (adres klienta potwierdzony sekretem do limitu wysyłek) */
export async function POST(request: Request) {
  const res = await fetch(`${API_BASE_URL}/contact/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...clientHeaders(request),
    },
    body: await request.text(),
    cache: 'no-store',
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
