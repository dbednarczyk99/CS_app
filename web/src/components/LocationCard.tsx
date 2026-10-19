import { FaLocationArrow, FaPhone, FaStar } from 'react-icons/fa6';
import type { Location } from '@/lib/api';
import { groupedHours, plural, telHref } from '@/lib/format';
import { OpenStatus } from './OpenStatus';
import { PhotoCarousel } from './PhotoCarousel';
import { ShowOnMapButton } from './StoresMap';

export function LocationCard({
  location,
  index,
  showHours = true,
  showOnMap = false,
  showPhotos = false,
  showReviews = false,
}: {
  location: Location;
  index: number;
  showHours?: boolean;
  showOnMap?: boolean;
  showPhotos?: boolean;
  /** ocena Google i link „Oceń nas” (gdy piekarnia ma w panelu identyfikator miejsca Google) */
  showReviews?: boolean;
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
        {showReviews && <GoogleRating location={location} />}

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

const ratingFormat = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * Ocena piekarni w Google (odświeżana przez API raz dziennie) i link do wystawienia opinii.
 * Bez oceny (brak klucza Google w API albo za mało opinii) – sam link „Oceń nas w Google”.
 */
function GoogleRating({ location }: { location: Location }) {
  if (!location.googlePlaceId) return null;
  const reviewUrl = `https://search.google.com/local/writereview?placeid=${encodeURIComponent(location.googlePlaceId)}`;
  const count = location.googleRatingCount ?? 0;
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      {location.googleRating != null && count > 0 && (
        <span className="flex items-center gap-1.5">
          <FaStar aria-hidden className="text-gold" />
          <span className="font-display text-base text-cream">{ratingFormat.format(location.googleRating)}</span>
          <span className="text-stone">
            · {count} {plural(count, ['opinia', 'opinie', 'opinii'])} w Google
          </span>
        </span>
      )}
      <a href={reviewUrl} target="_blank" rel="noreferrer" className="link-arrow text-[0.7rem]">
        Oceń nas w Google
      </a>
    </p>
  );
}
