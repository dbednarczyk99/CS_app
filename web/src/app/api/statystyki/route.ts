import { API_BASE_URL } from '@/lib/api';

/**
 * Pośrednik statystyk: przeglądarka → strona → API. Przekazuje adres klienta (tylko do limitu zdarzeń
 * w pamięci API) i przeglądarkę (odsiewanie robotów). Zapisywane są wyłącznie dzienne liczniki.
 */
export async function POST(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '';
  await fetch(`${API_BASE_URL}/stats/event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': request.headers.get('user-agent') ?? '',
      ...(forwardedFor ? { 'X-Forwarded-For': forwardedFor } : {}),
    },
    body: await request.text(),
    cache: 'no-store',
  }).catch(() => undefined);
  return new Response(null, { status: 204 });
}
