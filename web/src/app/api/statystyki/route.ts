import { API_BASE_URL } from '@/lib/api';
import { clientHeaders } from '@/lib/proxy';

/**
 * Pośrednik statystyk: przeglądarka → strona → API. Przekazuje adres klienta (tylko do limitu zdarzeń
 * w pamięci API) i przeglądarkę (odsiewanie robotów). Zapisywane są wyłącznie dzienne liczniki.
 */
export async function POST(request: Request) {
  await fetch(`${API_BASE_URL}/stats/event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': request.headers.get('user-agent') ?? '',
      ...clientHeaders(request),
    },
    body: await request.text(),
    cache: 'no-store',
  }).catch(() => undefined);
  return new Response(null, { status: 204 });
}
