import { ReservationForm } from '@/components/ReservationForm';
import { api, orFallback } from '@/lib/api';
import { isAvailable, promoWindow } from '@/lib/products';
import { getContent, seoMetadata } from '@/lib/content';

export const generateMetadata = () => seoMetadata('seo.reservation', { path: '/rezerwacja', noindex: true });

// terminy zależą od bieżącej godziny – strona zawsze świeża
export const dynamic = 'force-dynamic';

export default async function ReservationPage() {
  const [options, products, content] = await Promise.all([
    orFallback(api.reservationOptions(), null),
    orFallback(api.products(), []),
    getContent(),
  ]);
  // nagłówek – z panelu (Strona → Podstrony → Rezerwacja)
  const header = content['reservation.header'];

  // aktualne ceny (regularna + okres promocji – cena zależy od dnia odbioru) i dostępność – do odświeżenia zawartości zapamiętanej w przeglądarce
  const reservable = products
    .filter((p) => isAvailable(p) && p.isReservable)
    .map((p) => ({ id: p.id, name: p.name, price: p.price, promo: promoWindow(p), image: p.images?.[0]?.imgUrl }));

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-header sm:px-8">
      <p className="eyebrow">{header.eyebrow}</p>
      <h1 className="heading mt-3 text-4xl sm:text-5xl">{header.title}</h1>
      {header.text && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone">{header.text}</p>}
      <div className="mt-12">
        {options ? (
          <ReservationForm options={options} reservable={reservable} texts={content['reservation.form']} />
        ) : (
          <p className="border border-line bg-coal p-6 text-stone">{header.unavailable}</p>
        )}
      </div>
    </div>
  );
}
