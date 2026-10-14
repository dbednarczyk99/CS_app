import { FaLocationArrow, FaPhone } from 'react-icons/fa6';
import type { Location } from '@/lib/api';
import { WEEKDAYS, hoursFor, telHref } from '@/lib/format';
import { OpenStatus } from './OpenStatus';
import { ShowOnMapButton } from './StoresMap';

export function LocationCard({
  location,
  index,
  showHours = true,
  showOnMap = false,
}: {
  location: Location;
  index: number;
  showHours?: boolean;
  showOnMap?: boolean;
}) {
  const [street, city] = location.address.split(/,\s*(?=\d{2}-\d{3})/);

  return (
    <article className="flex h-full flex-col border border-line bg-coal p-6 transition-colors hover:border-gold/40 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <span className="font-display text-4xl text-gold/70">{String(index + 1).padStart(2, '0')}</span>
        <OpenStatus hours={location.openingHours} />
      </div>
      <h3 className="heading mt-6 text-xl">{street}</h3>
      {city && <p className="mt-1 text-stone">{city}</p>}

      {showHours && location.openingHours && (
        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
          {WEEKDAYS.map((day) => {
            const hours = hoursFor(location.openingHours, day.key);
            return (
              <div key={day.key} className="contents">
                <dt className="text-stone">{day.label}</dt>
                <dd className="tabular-nums">{hours ? `${hours[0]}–${hours[1]}` : 'nieczynne'}</dd>
              </div>
            );
          })}
        </dl>
      )}

      <div className="mt-auto flex flex-wrap gap-3 pt-8">
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
    </article>
  );
}
