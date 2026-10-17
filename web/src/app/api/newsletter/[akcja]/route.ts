import { API_BASE_URL } from '@/lib/api';

// /api/newsletter/zapisz | potwierdz | wypisz → API /newsletter/subscribe | confirm | unsubscribe
const ACTIONS: Record<string, string> = { zapisz: 'subscribe', potwierdz: 'confirm', wypisz: 'unsubscribe' };

/** Pośrednik newslettera: przeglądarka → strona → API (adres klienta w X-Forwarded-For do limitu zapisów) */
export async function POST(request: Request, { params }: { params: Promise<{ akcja: string }> }) {
  const action = ACTIONS[(await params).akcja];
  if (!action) return Response.json({ message: 'Nie znaleziono' }, { status: 404 });

  const forwardedFor = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '';
  const res = await fetch(`${API_BASE_URL}/newsletter/${action}`, {
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
