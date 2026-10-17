import { API_BASE_URL } from '@/lib/api';

/** Pośrednik formularza kontaktowego: przeglądarka → strona → API (adres klienta w X-Forwarded-For do limitu wysyłek) */
export async function POST(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '';
  const res = await fetch(`${API_BASE_URL}/contact/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(forwardedFor ? { 'X-Forwarded-For': forwardedFor } : {}),
    },
    body: await request.text(),
    cache: 'no-store',
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
