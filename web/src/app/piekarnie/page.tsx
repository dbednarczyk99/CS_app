import type { Metadata } from 'next';
import Image from 'next/image';
import { LocationCard } from '@/components/LocationCard';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { api, orFallback } from '@/lib/api';
import { plural } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Piekarnie',
  description: 'Adresy, telefony i dojazd do piekarni Chleba Smak w Krakowie.',
};

export default async function LocationsPage() {
  const locations = await orFallback(api.locations(), []);

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
              <LocationCard location={location} index={i} />
            </Reveal>
          ))}
        </div>

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
      </div>
    </>
  );
}
