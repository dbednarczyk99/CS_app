import { FaLocationArrow, FaPhone } from 'react-icons/fa6';
import type { Location } from '@/lib/api';
import { groupedHours, telHref } from '@/lib/format';
import { OpenStatus } from './OpenStatus';
import { PhotoCarousel } from './PhotoCarousel';
import { ShowOnMapButton } from './StoresMap';

export function LocationCard({
  location,
  index,
  showHours = true,
  showOnMap = false,
  showPhotos = false,
}: {
  location: Location;
  index: number;
  showHours?: boolean;
  showOnMap?: boolean;
  showPhotos?: boolean;
}) {
  const [street, city] = location.address.split(/,\s*(?=\d{2}-\d{3})/);
  const photos = showPhotos && location.images && location.images.length > 0 ? location.images : null;

  return (
    // ze zdjęciami od lg: układ poziomy (zdjęcie | szczegóły), żeby kafelek mieścił się na ekranie
    <article
      className={`flex h-full flex-col border border-line bg-coal transition-colors hover:border-gold/40 ${
        photos ? 'lg:flex-row' : ''
      }`}
    >
      {photos && (
        <PhotoCarousel
          images={photos}
          alt={`Piekarnia Chleba Smak, ${street}`}
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
          offset={(index % 4) * 1200}
          className="aspect-[3/2] lg:aspect-auto lg:w-[46%] lg:shrink-0"
        />
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="font-display text-4xl text-gold/70">{String(index + 1).padStart(2, '0')}</span>
          <OpenStatus hours={location.openingHours} />
        </div>
        <h3 className="heading mt-5 text-xl">{street}</h3>
        {city && <p className="mt-1 text-stone">{city}</p>}

        {showHours && location.openingHours && (
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
            {groupedHours(location.openingHours).map((group) => (
              <div key={group.label} className="contents">
                <dt className="text-stone">{group.label}</dt>
                <dd className="tabular-nums">{group.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          {location.phone && (
            <a href={telHref(location.phone)} className="btn btn-outline min-h-11 flex-1 px-4 text-[0.75rem]">
              <FaPhone aria-hidden /> Zadzwoń
            </a>
          )}
          <a
            href={location.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline min-h-11 flex-1 px-4 text-[0.75rem]"
          >
            <FaLocationArrow aria-hidden /> Nawiguj
          </a>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-stone">
          {location.phone && <span>{location.phone}</span>}
          {showOnMap && location.lat != null && <ShowOnMapButton id={location.id} />}
        </div>
      </div>
    </article>
  );
}
