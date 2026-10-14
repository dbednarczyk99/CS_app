'use client';

import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
} from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaBreadSlice, FaLocationArrow, FaPhone, FaTruck, FaXmark } from 'react-icons/fa6';
import type { BreadVanStop, Location, Weekday } from '@/lib/api';
import { WEEKDAYS, hoursFor, telHref, weekdayOf } from '@/lib/format';
import { OpenStatus } from './OpenStatus';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
// Map ID ze stylem z docs/mapa-styl.json; DEMO_MAP_ID = domyślna ciemna mapa Google (z obcymi pinezkami)
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
const KRAKOW = { lat: 50.0647, lng: 19.945 };

/** Zdarzenie wysyłane przez przyciski „Pokaż na mapie” w kartach piekarni */
export const SHOW_ON_MAP_EVENT = 'pokaz-na-mapie';

type Filter = 'all' | 'stores' | 'van';

type Point =
  | { kind: 'store'; id: string; lat: number; lng: number; location: Location }
  | { kind: 'van'; id: string; lat: number; lng: number; stop: BreadVanStop };

const navigateHref = (p: Point) =>
  `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

const splitAddress = (address: string) => {
  const [street, city] = address.split(/,\s*(?=\d{2}-\d{3})/);
  return { street, city };
};

const dayLabel = (day: Weekday) => WEEKDAYS.find((d) => d.key === day)?.label ?? day;

export function StoresMap({
  locations,
  stops,
  initialFilter = 'all',
}: {
  locations: Location[];
  stops: BreadVanStop[];
  initialFilter?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [today, setToday] = useState<Weekday | null>(null);
  useEffect(() => setToday(weekdayOf(new Date())), []);

  const points = useMemo<Point[]>(() => {
    const result: Point[] = [];
    if (filter !== 'van') {
      for (const location of locations) {
        if (location.lat != null && location.lng != null) {
          result.push({ kind: 'store', id: location.id, lat: location.lat, lng: location.lng, location });
        }
      }
    }
    if (filter !== 'stores') {
      for (const stop of stops) {
        if (stop.lat != null && stop.lng != null) {
          result.push({ kind: 'van', id: stop.id, lat: stop.lat, lng: stop.lng, stop });
        }
      }
    }
    return result;
  }, [locations, stops, filter]);

  const selected = points.find((p) => p.id === selectedId) ?? null;

  // „Pokaż na mapie” z kart piekarni
  useEffect(() => {
    const onShow = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      setFilter((f) => (f === 'van' ? 'all' : f));
      setSelectedId(id);
      document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    window.addEventListener(SHOW_ON_MAP_EVENT, onShow);
    return () => window.removeEventListener(SHOW_ON_MAP_EVENT, onShow);
  }, []);

  const hasVan = stops.some((s) => s.lat != null);
  const hasStores = locations.some((l) => l.lat != null);

  return (
    <div id="mapa">
      {hasVan && hasStores && (
        <div role="group" aria-label="Pokaż na mapie" className="mb-4 flex flex-wrap gap-2">
          {(
            [
              ['all', 'Wszystko', null],
              ['stores', 'Piekarnie', <FaBreadSlice key="s" aria-hidden />],
              ['van', 'Chlebowóz', <FaTruck key="v" aria-hidden />],
            ] as const
          ).map(([value, label, icon]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => {
                setFilter(value);
                setSelectedId(null);
              }}
              className={`inline-flex items-center gap-2 border px-4 py-2 font-display text-[0.75rem] uppercase tracking-[0.2em] transition-colors ${
                filter === value
                  ? 'border-gold bg-gold text-ink'
                  : 'border-line text-cream/85 hover:border-gold hover:text-gold'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      )}

      <div className="relative h-[70svh] min-h-[420px] overflow-hidden border border-line bg-coal sm:h-[560px]">
        {API_KEY ? (
          <APIProvider apiKey={API_KEY} language="pl" region="PL">
            <GoogleMap
              mapId={MAP_ID}
              colorScheme="DARK"
              defaultCenter={KRAKOW}
              defaultZoom={12}
              gestureHandling="cooperative"
              disableDefaultUI
              zoomControl
              clickableIcons={false}
              onClick={() => setSelectedId(null)}
              className="size-full"
            >
              <FitBounds points={points} />
              <PanTo point={selected} />
              {points.map((point) => (
                <PointMarker
                  key={point.id}
                  point={point}
                  today={today}
                  active={point.id === selectedId}
                  onSelect={() => setSelectedId((id) => (id === point.id ? null : point.id))}
                />
              ))}
            </GoogleMap>
          </APIProvider>
        ) : (
          <MapPlaceholder />
        )}

        {selected && <DetailsCard point={selected} today={today} onClose={() => setSelectedId(null)} />}
      </div>
    </div>
  );
}

/** Dopasowanie widoku do widocznych punktów (przy starcie i zmianie filtra) */
function FitBounds({ points }: { points: Point[] }) {
  const map = useMap();
  useEffect(() => {
    if (!map || points.length === 0) return;
    if (points.length === 1) {
      map.setCenter(points[0]);
      map.setZoom(15);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    points.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 64);
  }, [map, points]);
  return null;
}

function PanTo({ point }: { point: Point | null }) {
  const map = useMap();
  useEffect(() => {
    if (map && point) map.panTo(point);
  }, [map, point]);
  return null;
}

function PointMarker({
  point,
  today,
  active,
  onSelect,
}: {
  point: Point;
  today: Weekday | null;
  active: boolean;
  onSelect: () => void;
}) {
  const isStore = point.kind === 'store';
  const vanToday = point.kind === 'van' && point.stop.dayOfTheWeek === today;
  const dimmed = point.kind === 'van' && today !== null && !vanToday && !active;

  const title = isStore ? splitAddress(point.location.address).street : point.stop.address;
  let subtitle: string;
  if (point.kind === 'store') {
    const hours = today ? hoursFor(point.location.openingHours, today) : null;
    subtitle = hours ? `Dziś ${hours[0]}–${hours[1]}` : 'Piekarnia';
  } else {
    subtitle = `${vanToday ? 'Dziś' : dayLabel(point.stop.dayOfTheWeek)} ${point.stop.startTime}–${point.stop.endTime}`;
  }

  return (
    <AdvancedMarker
      position={point}
      onClick={onSelect}
      zIndex={active ? 1000 : isStore ? 100 : vanToday ? 90 : 10}
      title={`${isStore ? 'Piekarnia' : 'Chlebowóz'}: ${title}`}
    >
      <div className={`group relative flex flex-col items-center ${dimmed ? 'opacity-60' : ''}`}>
        {/* podgląd po najechaniu (komputer) */}
        <div className="pointer-events-none absolute bottom-full mb-2 hidden whitespace-nowrap border border-line bg-ink/95 px-3 py-2 text-left shadow-lg group-hover:block">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.25em] text-gold">
            {isStore ? 'Piekarnia' : 'Chlebowóz'}
          </p>
          <p className="mt-0.5 text-sm text-cream">{title}</p>
          <p className="text-xs text-stone">{subtitle}</p>
        </div>

        <div
          className={`grid place-items-center rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110 ${
            active ? 'scale-115' : ''
          } ${
            isStore
              ? 'size-11 bg-gold text-ink'
              : `size-9 border-2 bg-ink ${vanToday || active ? 'border-gold text-gold' : 'border-cream/60 text-cream'}`
          }`}
        >
          {isStore ? <FaBreadSlice size={18} /> : <FaTruck size={14} />}
        </div>
        <div className={`-mt-1 size-2 rotate-45 ${isStore ? 'bg-gold' : vanToday || active ? 'bg-gold' : 'bg-cream/60'}`} />
        {vanToday && (
          <span className="absolute -right-5 -top-2 bg-gold px-1.5 font-display text-[0.55rem] uppercase tracking-[0.15em] text-ink">
            Dziś
          </span>
        )}
      </div>
    </AdvancedMarker>
  );
}

function DetailsCard({
  point,
  today,
  onClose,
}: {
  point: Point;
  today: Weekday | null;
  onClose: () => void;
}) {
  const isStore = point.kind === 'store';

  return (
    <div
      role="dialog"
      aria-label="Szczegóły punktu"
      className="absolute inset-x-3 bottom-3 z-10 border border-line bg-ink/95 p-5 shadow-2xl backdrop-blur-md sm:inset-x-auto sm:left-4 sm:top-4 sm:bottom-auto sm:w-80"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Zamknij"
        className="absolute right-3 top-3 grid size-9 place-items-center text-stone transition-colors hover:text-gold"
      >
        <FaXmark size={18} />
      </button>

      {point.kind === 'store' ? (
        <StoreDetails location={point.location} today={today} />
      ) : (
        <VanDetails stop={point.stop} today={today} />
      )}

      <div className="mt-5 flex gap-2">
        {isStore && point.location.phone && (
          <a href={telHref(point.location.phone)} className="btn btn-outline min-h-11 flex-1 px-3 text-[0.7rem]">
            <FaPhone aria-hidden /> Zadzwoń
          </a>
        )}
        <a
          href={navigateHref(point)}
          target="_blank"
          rel="noreferrer"
          className="btn btn-gold min-h-11 flex-1 px-3 text-[0.7rem]"
        >
          <FaLocationArrow aria-hidden /> Nawiguj
        </a>
      </div>
    </div>
  );
}

function StoreDetails({ location, today }: { location: Location; today: Weekday | null }) {
  const { street, city } = splitAddress(location.address);
  const hours = today ? hoursFor(location.openingHours, today) : null;
  return (
    <>
      <p className="eyebrow text-[0.65rem]">Piekarnia</p>
      <h3 className="heading mt-2 pr-8 text-xl">{street}</h3>
      {city && <p className="text-sm text-stone">{city}</p>}
      <div className="mt-4 space-y-1 text-sm">
        <OpenStatus hours={location.openingHours} />
        {location.openingHours && (
          <p className="text-stone">Dziś: {hours ? `${hours[0]}–${hours[1]}` : 'nieczynne'}</p>
        )}
        {location.phone && <p className="text-stone">{location.phone}</p>}
      </div>
    </>
  );
}

function VanDetails({ stop, today }: { stop: BreadVanStop; today: Weekday | null }) {
  const isToday = stop.dayOfTheWeek === today;
  return (
    <>
      <p className="eyebrow text-[0.65rem]">Chlebowóz</p>
      <h3 className="heading mt-2 pr-8 text-xl">{stop.address}</h3>
      <p className="mt-4 flex items-center gap-3 text-sm">
        {isToday && (
          <span className="bg-gold px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-[0.2em] text-ink">
            Dziś
          </span>
        )}
        <span className="text-cream">{dayLabel(stop.dayOfTheWeek)}</span>
        <span className="font-display tracking-wider text-gold">
          {stop.startTime}–{stop.endTime}
        </span>
      </p>
    </>
  );
}

function MapPlaceholder() {
  return (
    <div className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_40%,rgb(201_163_106/0.08),transparent_60%)] p-8 text-center">
      <div>
        <p className="eyebrow">Mapa</p>
        <p className="heading mt-3 text-2xl">Mapa pojawi się wkrótce</p>
        <p className="mt-3 text-sm text-stone">Poniżej znajdziesz adresy i przyciski nawigacji.</p>
      </div>
    </div>
  );
}

/** Przycisk w karcie piekarni – przewija do mapy i otwiera szczegóły punktu */
export function ShowOnMapButton({ id }: { id: string }) {
  const onClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent(SHOW_ON_MAP_EVENT, { detail: id }));
  }, [id]);
  return (
    <button type="button" onClick={onClick} className="link-arrow text-[0.7rem]">
      Pokaż na mapie
    </button>
  );
}
