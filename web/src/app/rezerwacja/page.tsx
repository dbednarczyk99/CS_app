import type { Metadata } from 'next';
import { ReservationForm } from '@/components/ReservationForm';
import { api, orFallback } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Rezerwacja',
  description: 'Zarezerwuj pieczywo z odbiorem w piekarni Chleba Smak lub z chlebowozu. Płatność przy odbiorze.',
  robots: { index: false },
};

// terminy zależą od bieżącej godziny – strona zawsze świeża
export const dynamic = 'force-dynamic';

export default async function ReservationPage() {
  const [options, products] = await Promise.all([
    orFallback(api.reservationOptions(), null),
    orFallback(api.products(), []),
  ]);

  // aktualne ceny i dostępność – do odświeżenia zawartości zapamiętanej w przeglądarce
  const reservable = products
    .filter((p) => p.isActive && p.isReservable)
    .map((p) => ({ id: p.id, name: p.name, price: p.price, image: p.images?.[0]?.imgUrl }));

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-header sm:px-8">
      <p className="eyebrow">Rezerwacja</p>
      <h1 className="heading mt-3 text-4xl sm:text-5xl">Zarezerwuj pieczywo</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone">
        Odbierz w wybranej piekarni lub z chlebowozu. Płacisz na miejscu, przy odbiorze.
      </p>
      <div className="mt-12">
        {options ? (
          <ReservationForm options={options} reservable={reservable} />
        ) : (
          <p className="border border-line bg-coal p-6 text-stone">
            Rezerwacje są chwilowo niedostępne. Spróbuj ponownie za kilka minut lub zadzwoń do piekarni.
          </p>
        )}
      </div>
    </div>
  );
}
