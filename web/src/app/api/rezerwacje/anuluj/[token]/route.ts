import { API_BASE_URL } from '@/lib/api';

export async function POST(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const res = await fetch(`${API_BASE_URL}/reservations/cancel/${encodeURIComponent(token)}`, {
    method: 'POST',
    cache: 'no-store',
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
