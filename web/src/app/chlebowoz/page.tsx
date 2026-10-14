import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeading } from '@/components/SectionHeading';
import { StoresMap } from '@/components/StoresMap';
import { VanSchedule } from '@/components/VanSchedule';
import { api, orFallback } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Chlebowóz',
  description: 'Trasa chlebowozu Chleba Smak – gdzie i kiedy kupisz nasze świeże pieczywo.',
};

export default async function BreadVanPage() {
  const [description, stops] = await Promise.all([
    orFallback(api.breadVanDescription(), null),
    orFallback(api.breadVanStops(), []),
  ]);

  return (
    <>
      <PageHeader eyebrow="Chlebowóz" title="Świeże pieczywo w drodze" image="/images/chlebowoz.jpg">
        {description?.shortDescription ?? 'Przyjeżdżamy z pieczywem prosto z pieca w kolejne miejsca Krakowa.'}
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="Jak to działa" title="Stałe dni, stałe miejsca">
            {description?.longDescription ? (
              <p>{description.longDescription}</p>
            ) : (
              <p>
                Chlebowóz zatrzymuje się w stałych punktach miasta według tygodniowego harmonogramu.
                Wystarczy przyjść o wskazanej porze.
              </p>
            )}
          </SectionHeading>
        </div>
        <div>
          <h2 className="heading text-2xl">Trasa w tym tygodniu</h2>
          <div className="mt-6">
            <VanSchedule stops={stops} />
          </div>
        </div>
      </div>

      {stops.some((s) => s.lat != null) && (
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <h2 className="heading mb-6 text-2xl">Przystanki na mapie</h2>
          <StoresMap locations={[]} stops={stops} initialFilter="van" />
        </section>
      )}
    </>
  );
}
