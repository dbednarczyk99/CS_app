import { API_BASE_URL } from '@/lib/api';
import { clientHeaders } from '@/lib/proxy';

// /api/newsletter/zapisz | potwierdz | wypisz → API /newsletter/subscribe | confirm | unsubscribe
const ACTIONS: Record<string, string> = { zapisz: 'subscribe', potwierdz: 'confirm', wypisz: 'unsubscribe' };

/** Pośrednik newslettera: przeglądarka → strona → API (adres klienta potwierdzony sekretem do limitu zapisów) */
export async function POST(request: Request, { params }: { params: Promise<{ akcja: string }> }) {
  const action = ACTIONS[(await params).akcja];
  if (!action) return Response.json({ message: 'Nie znaleziono' }, { status: 404 });

  const res = await fetch(`${API_BASE_URL}/newsletter/${action}`, {
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
