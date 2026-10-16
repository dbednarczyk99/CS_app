import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

// Wywoływane przez API po zmianach w panelu – czyści cache wszystkich stron (ISR)
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
