import type { Metadata } from 'next';
import Image from 'next/image';
import { CrossPromo } from '@/components/CrossPromo';
import { LocationCard } from '@/components/LocationCard';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { StoresMap } from '@/components/StoresMap';
import { api, orFallback } from '@/lib/api';
import { plural } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Piekarnie',
  description: 'Adresy, godziny otwarcia, telefony i dojazd do piekarni Chleba Smak w Krakowie.',
};

export default async function LocationsPage() {
  const [locations, stops] = await Promise.all([
    orFallback(api.locations(), []),
    orFallback(api.breadVanStops(), []),
  ]);
  const hasMap = locations.some((l) => l.lat != null);
  // ten sam adres może być przystankiem w kilka dni tygodnia
  const vanPlaces = new Set(stops.map((s) => s.address)).size;

  return (
    <>
      <PageHeader eyebrow="Odwiedź nas" title="Nasze piekarnie" image="/images/lokal.jpg">
        {locations.length > 0
          ? `${locations.length} ${plural(locations.length, ['miejsce', 'miejsca', 'miejsc'])} w Krakowie, w których czeka na Ciebie świeże pieczywo.`
          : 'Miejsca w Krakowie, w których czeka na Ciebie świeże pieczywo.'}
      </PageHeader>

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
        <div className="grid gap-4 sm:grid-cols-2">
          {locations.map((location, i) => (
            <Reveal key={location.id} delay={(i % 2) * 100} className="h-full">
              <LocationCard location={location} index={i} showOnMap={hasMap} showPhotos />
            </Reveal>
          ))}
        </div>

        {hasMap && (
          <section className="mt-20">
            <h2 className="heading mb-6 text-2xl">Piekarnie na mapie</h2>
            {/* ta sama mapa co na /chlebowoz – tu domyślnie z filtrem „Piekarnie” */}
            <StoresMap locations={locations} stops={stops} initialFilter="stores" />
          </section>
        )}

        <Reveal className="mt-20 grid items-center gap-10 border-t border-line pt-20 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4]">
            <Image
              src="/images/wnetrze.jpg"
              alt="Wnętrze piekarni Chleba Smak"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Na miejscu</p>
            <h2 className="heading mt-3 text-3xl sm:text-4xl">Usiądź na chwilę</h2>
            <div className="mt-5 h-px w-16 bg-gold" />
            <p className="mt-6 text-lg leading-relaxed text-stone">
              W naszych piekarniach poza pieczywem znajdziesz kawę, kanapki przygotowywane na
              miejscu, słodkie wypieki i – w sezonie – lody rzemieślnicze.
            </p>
          </div>
        </Reveal>

        {stops.length > 0 && (
          <div className="mt-20">
            <CrossPromo
              eyebrow="Chlebowóz"
              title="Może masz bliżej do chlebowozu?"
              href="/chlebowoz"
              cta="Sprawdź trasę chlebowozu"
              image="/images/chlebowoz.jpg"
              imageAlt="Chlebowóz Chleba Smak"
              reverse
            >
              Nasz chlebowóz zatrzymuje się w {vanPlaces}{' '}
              {vanPlaces === 1 ? 'miejscu' : 'miejscach'} Krakowa według stałego,
              tygodniowego harmonogramu. Sprawdź, czy nie przyjeżdża w Twoją okolicę – pieczywo
              możesz u niego także zarezerwować.
            </CrossPromo>
          </div>
        )}
      </div>
    </>
  );
}
