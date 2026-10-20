import { CrossPromo } from '@/components/CrossPromo';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeading } from '@/components/SectionHeading';
import { StoresMap } from '@/components/StoresMap';
import { VanSchedule } from '@/components/VanSchedule';
import { api, orFallback } from '@/lib/api';
import { fill, getContent, seoMetadata } from '@/lib/content';
import { getServiceStatus } from '@/lib/services';
import { MapFallback } from '@/components/MapFallback';
import { WEEKDAYS } from '@/lib/format';

export const generateMetadata = () => seoMetadata('seo.van', { path: '/chlebowoz' });

/** Nagłówki i ramka – z panelu (Strona → Podstrony → Chlebowóz); opis i trasa – Piekarnie → Chlebowóz */
export default async function BreadVanPage() {
  const [description, stops, locations, content, services] = await Promise.all([
    orFallback(api.breadVanDescription(), null),
    orFallback(api.breadVanStops(), []),
    orFallback(api.locations(), []),
    getContent(),
    getServiceStatus(),
  ]);
  const header = content['van.header'];
  const schedule = content['van.schedule'];
  const promo = content['van.locations'];

  return (
    <>
      <PageHeader eyebrow={header.eyebrow} title={header.title} image={header.image.url}>
        {description?.shortDescription ?? 'Przyjeżdżamy z pieczywem prosto z pieca w kolejne miejsca Krakowa.'}
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow={schedule.eyebrow} title={schedule.title}>
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
          <h2 className="heading text-2xl">{schedule.scheduleTitle}</h2>
          <div className="mt-6">
            <VanSchedule stops={stops} />
          </div>
        </div>
      </div>

      {/* mapa wyłączona w panelu / po dziennym limicie – lista przystanków z linkami do Map Google */}
      {!services.maps && stops.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <h2 className="heading mb-6 text-2xl">{schedule.mapTitle}</h2>
          <MapFallback
            places={stops.map((s) => ({
              key: s.id,
              label: s.address,
              detail: `${WEEKDAYS.find((d) => d.key === s.dayOfTheWeek)?.label ?? ''}, ${s.startTime}–${s.endTime}`,
              href: s.googleMapsUrl,
            }))}
          />
        </section>
      )}
      {services.maps && stops.some((s) => s.lat != null) && (
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <h2 className="heading mb-6 text-2xl">{schedule.mapTitle}</h2>
          {/* ta sama mapa co na /piekarnie – tu domyślnie z filtrem „Chlebowóz” */}
          <StoresMap locations={locations} stops={stops} initialFilter="van" />
        </section>
      )}

      {locations.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <CrossPromo
            eyebrow={promo.eyebrow}
            title={promo.title}
            href="/piekarnie"
            cta={promo.cta}
            image={promo.image.url}
            imageAlt={promo.image.alt}
          >
            {fill(promo.text, {
              piekarnie: locations.length === 1 ? 'naszej piekarni' : `jednej z ${locations.length} naszych piekarni`,
            })}
          </CrossPromo>
        </section>
      )}
    </>
  );
}
