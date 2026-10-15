import type { Metadata } from 'next';
import Link from 'next/link';
import { CancelReservation } from '@/components/CancelReservation';
import { api, orFallback } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Anulowanie rezerwacji',
  robots: { index: false },
};

export const dynamic = 'force-dynamic';

export default async function CancelPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const reservation = await orFallback(api.reservationByToken(token), null);

  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <p className="eyebrow">Rezerwacja</p>
      <h1 className="heading mt-3 text-4xl">Anulowanie rezerwacji</h1>
      <div className="mt-10">
        {reservation ? (
          <CancelReservation token={token} initial={reservation} />
        ) : (
          <div className="border border-line bg-coal p-8">
            <p className="text-lg">Nie znaleźliśmy tej rezerwacji.</p>
            <p className="mt-2 text-stone">Sprawdź, czy link z e-maila został skopiowany w całości.</p>
            <Link href="/" className="btn btn-outline mt-6">
              Strona główna
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
