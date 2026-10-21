import Image from 'next/image';
import { CrossPromo } from '@/components/CrossPromo';
import { LocationCard } from '@/components/LocationCard';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { StoresMap } from '@/components/StoresMap';
import { api, orFallback } from '@/lib/api';
import { plural } from '@/lib/format';
import { fill, getContent, seoMetadata } from '@/lib/content';
import { getServiceStatus } from '@/lib/services';
import { MapFallback } from '@/components/MapFallback';
import { MapConsentGate } from '@/components/MapConsentGate';
import { JsonLd } from '@/components/JsonLd';
import { bakeryLd } from '@/lib/structured-data';

export const generateMetadata = () => seoMetadata('seo.locations', { path: '/piekarnie' });

/** Teksty i zdjęcia – z panelu (Strona → Podstrony → Piekarnie) */
export default async function LocationsPage() {
  const [locations, stops, content, services] = await Promise.all([
    orFallback(api.locations(), []),
    orFallback(api.breadVanStops(), []),
    getContent(),
    getServiceStatus(),
  ]);
  const header = content['locations.header'];
  const onsite = content['locations.onsite'];
  const promo = content['locations.van'];
  const cookies = content['common.cookies'];
  // „{miejsca} w Krakowie…” → „4 miejsca w Krakowie…”; bez piekarni (awaria API) – „Miejsca w Krakowie…”
  const count = `${locations.length} ${plural(locations.length, ['miejsce', 'miejsca', 'miejsc'])}`;
  const intro = fill(header.text, { miejsca: locations.length > 0 ? count : 'miejsca' });
  // mapa: są współrzędne i usługa działa (wyłącznik / limit dzienny w panelu – wtedy lista z linkami)
  const hasMap = locations.some((l) => l.lat != null) && services.maps;
  // ten sam adres może być przystankiem w kilka dni tygodnia
  const vanPlaces = new Set(stops.map((s) => s.address)).size;

  return (
    <>
      {/* dane dla Google: każda piekarnia z adresem, położeniem, telefonem i godzinami */}
      <JsonLd data={locations.map(bakeryLd)} />

      <PageHeader eyebrow={header.eyebrow} title={header.title} image={header.image.url}>
        {intro ? intro.charAt(0).toUpperCase() + intro.slice(1) : null}
      </PageHeader>

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {locations.map((location, i) => (
            <Reveal key={location.id} delay={(i % 2) * 100} className="h-full">
              <LocationCard location={location} index={i} showOnMap={hasMap} showPhotos showReviews />
            </Reveal>
          ))}
        </div>

        {hasMap && (
          <section className="mt-20">
            <h2 className="heading mb-6 text-2xl">Piekarnie na mapie</h2>
            {/* ta sama mapa co na /chlebowoz – tu domyślnie z filtrem „Piekarnie” */}
            <MapConsentGate
              required={cookies.requireMapConsent}
              notice={cookies.mapNotice}
              button={cookies.mapButton}
              fallback={
                <MapFallback
                  note="Bez mapy: każde miejsce otworzysz w Mapach Google."
                  places={locations.map((l) => ({ key: l.id, label: l.address, detail: l.phone ?? undefined, href: l.googleMapsUrl }))}
                />
              }
            >
              <StoresMap locations={locations} stops={stops} initialFilter="stores" />
            </MapConsentGate>
          </section>
        )}
        {!services.maps && locations.length > 0 && (
          <section className="mt-20">
            <h2 className="heading mb-6 text-2xl">Piekarnie na mapie</h2>
            <MapFallback
              places={locations.map((l) => ({ key: l.id, label: l.address, detail: l.phone ?? undefined, href: l.googleMapsUrl }))}
            />
          </section>
        )}

        <Reveal className="mt-20 grid items-center gap-10 border-t border-line pt-20 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4]">
            <Image
              src={onsite.image.url}
              alt={onsite.image.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">{onsite.eyebrow}</p>
            <h2 className="heading mt-3 text-3xl sm:text-4xl">{onsite.title}</h2>
            <div className="mt-5 h-px w-16 bg-gold" />
            <p className="mt-6 text-lg leading-relaxed text-stone">{onsite.text}</p>
          </div>
        </Reveal>

        {stops.length > 0 && (
          <div className="mt-20">
            <CrossPromo
              eyebrow={promo.eyebrow}
              title={promo.title}
              href="/chlebowoz"
              cta={promo.cta}
              image={promo.image.url}
              imageAlt={promo.image.alt}
              reverse
            >
              {fill(promo.text, { przystanki: `${vanPlaces} ${vanPlaces === 1 ? 'miejscu' : 'miejscach'}` })}
            </CrossPromo>
          </div>
        )}
      </div>
    </>
  );
}
