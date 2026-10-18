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
  // jeden przystanek w kilka dni tygodnia = jedna pinezka ze wszystkimi terminami (od poniedziałku)
  | { kind: 'van'; id: string; lat: number; lng: number; address: string; stops: BreadVanStop[] };

const weekdayIndex = (day: Weekday) => WEEKDAYS.findIndex((d) => d.key === day);

/** Termin postoju z perspektywy dziś: „Dziś” / „Jutro” / nazwa dnia */
const stopDay = (stop: BreadVanStop, today: Weekday | null, tomorrow: Weekday | null) =>
  stop.dayOfTheWeek === today ? 'Dziś' : stop.dayOfTheWeek === tomorrow ? 'Jutro' : dayLabel(stop.dayOfTheWeek);

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
  const [tomorrow, setTomorrow] = useState<Weekday | null>(null);
  useEffect(() => {
    const now = new Date();
    setToday(weekdayOf(now));
    setTomorrow(weekdayOf(new Date(now.getTime() + 24 * 60 * 60 * 1000)));
  }, []);

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
      // przystanki w tym samym miejscu (te same współrzędne) łączone w jedną pinezkę
      const byPlace = new Map<string, BreadVanStop[]>();
      for (const stop of stops) {
        if (stop.lat == null || stop.lng == null) continue;
        const key = `${stop.lat.toFixed(5)},${stop.lng.toFixed(5)}`;
        byPlace.set(key, [...(byPlace.get(key) ?? []), stop]);
      }
      for (const group of byPlace.values()) {
        const sorted = [...group].sort((a, b) => weekdayIndex(a.dayOfTheWeek) - weekdayIndex(b.dayOfTheWeek));
        const first = sorted[0];
        result.push({ kind: 'van', id: first.id, lat: first.lat!, lng: first.lng!, address: first.address, stops: sorted });
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
              // nasz ciemny styl z konsoli jest przypisany do trybu jasnego Map ID – zawsze go wymuszamy
              colorScheme={MAP_ID === 'DEMO_MAP_ID' ? 'DARK' : 'LIGHT'}
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
                  tomorrow={tomorrow}
                  active={point.id === selectedId}
                  onSelect={() => setSelectedId((id) => (id === point.id ? null : point.id))}
                />
              ))}
            </GoogleMap>
          </APIProvider>
        ) : (
          <MapPlaceholder />
        )}

        {selected && <DetailsCard point={selected} today={today} tomorrow={tomorrow} onClose={() => setSelectedId(null)} />}
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
    // punkt = czubek pinezki; sama pinezka (48 px) i znaczek DZIŚ/JUTRO wystają w górę i w prawo,
    // więc margines jest większy u góry i z prawej
    const narrow = (map.getDiv().clientWidth ?? 0) < 640;
    map.fitBounds(
      bounds,
      narrow
        ? { top: 80, right: 64, bottom: 32, left: 48 }
        : { top: 100, right: 90, bottom: 40, left: 60 },
    );
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
  tomorrow,
  active,
  onSelect,
}: {
  point: Point;
  today: Weekday | null;
  tomorrow: Weekday | null;
  active: boolean;
  onSelect: () => void;
}) {
  const isStore = point.kind === 'store';
  const vanToday = point.kind === 'van' && point.stops.some((s) => s.dayOfTheWeek === today);
  const vanTomorrow = point.kind === 'van' && point.stops.some((s) => s.dayOfTheWeek === tomorrow);
  const dimmed = point.kind === 'van' && today !== null && !vanToday && !vanTomorrow && !active;

  const title = isStore ? splitAddress(point.location.address).street : point.address;
  // podgląd: piekarnia – dzisiejsze godziny; przystanek – wszystkie terminy postoju
  let subtitles: string[];
  if (point.kind === 'store') {
    const hours = today ? hoursFor(point.location.openingHours, today) : null;
    subtitles = [hours ? `Dziś ${hours[0]}–${hours[1]}` : 'Piekarnia'];
  } else {
    subtitles = point.stops.map((s) => `${stopDay(s, today, tomorrow)} ${s.startTime}–${s.endTime}`);
  }

  // strona, po której pokazać podgląd: domyślnie z prawej, przy prawej krawędzi mapy – z lewej
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);
  const hasBadge = vanToday || vanTomorrow;

  return (
    <AdvancedMarker
      position={point}
      onClick={onSelect}
      zIndex={hoverSide ? 2000 : active ? 1000 : isStore ? 100 : vanToday ? 90 : vanTomorrow ? 80 : 10}
      title={`${isStore ? 'Piekarnia' : 'Chlebowóz'}: ${title}`}
    >
      <div
        className="group relative flex flex-col items-center"
        onMouseEnter={(event) => {
          const pin = event.currentTarget.getBoundingClientRect();
          const map = event.currentTarget.closest('#mapa')?.getBoundingClientRect();
          setHoverSide(map && pin.right + 280 > map.right ? 'left' : 'right');
        }}
        onMouseLeave={() => setHoverSide(null)}
      >
        {/* podgląd po najechaniu – obok pinezki, tylko na urządzeniach z kursorem */}
        {hoverSide && (
          <div
            className={`pointer-events-none absolute -top-1 hidden whitespace-nowrap border border-line bg-ink/95 px-3 py-2 text-left shadow-lg [@media(hover:hover)]:block ${
              hoverSide === 'right' ? `left-full ${hasBadge ? 'ml-10' : 'ml-3'}` : 'right-full mr-3'
            }`}
          >
            <p className="font-display text-[0.6rem] uppercase tracking-[0.25em] text-gold">
              {isStore ? 'Piekarnia' : 'Chlebowóz'}
            </p>
            <p className="mt-0.5 text-sm text-cream">{title}</p>
            {subtitles.map((line) => (
              <p key={line} className="text-xs text-stone">
                {line}
              </p>
            ))}
          </div>
        )}

        {/* jedna pinezka (SVG) – skaluje się jako całość, od czubka, który wskazuje miejsce */}
        <div
          className={`relative origin-bottom transition-transform duration-200 ease-out group-hover:scale-110 ${
            active ? 'scale-115' : ''
          } ${dimmed && !hoverSide ? 'opacity-70' : ''}`}
        >
          <Pin
            // piekarnia złota, chlebowóz kremowy; dziś / wybrany przystanek – złota obwódka
            fill={isStore ? 'var(--color-gold)' : 'var(--color-cream)'}
            stroke={!isStore && (vanToday || active) ? 'var(--color-gold)' : 'var(--color-ink)'}
            strokeWidth={!isStore && (vanToday || active) ? 3 : 1.5}
          />
          <span className="absolute left-1/2 top-[17px] -translate-x-1/2 -translate-y-1/2 text-ink">
            {isStore ? <FaBreadSlice size={15} /> : <FaTruck size={14} />}
          </span>
          {(vanToday || vanTomorrow) && (
            <span
              className={`absolute -right-7 -top-1 px-1.5 font-display text-[0.55rem] uppercase tracking-[0.15em] ${
                vanToday ? 'bg-gold text-ink' : 'border border-cream bg-ink text-cream'
              }`}
            >
              {vanToday ? 'Dziś' : 'Jutro'}
            </span>
          )}
        </div>
      </div>
    </AdvancedMarker>
  );
}

/** Smukła pinezka w kształcie kropli: okrągła główka (na ikonę) i wydłużony czubek */
export function Pin({ fill, stroke, strokeWidth }: { fill: string; stroke: string; strokeWidth: number }) {
  return (
    <svg
      width="34"
      height="48"
      viewBox="0 0 34 48"
      aria-hidden
      className="block drop-shadow-[0_4px_6px_rgba(0,0,0,0.55)]"
    >
      <path
        d="M17 46.5C14.6 39.6 3 28.6 3 17A14 14 0 0 1 31 17C31 28.6 19.4 39.6 17 46.5Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DetailsCard({
  point,
  today,
  tomorrow,
  onClose,
}: {
  point: Point;
  today: Weekday | null;
  tomorrow: Weekday | null;
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
        <VanDetails address={point.address} stops={point.stops} today={today} tomorrow={tomorrow} />
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

/** Przystanek ze wszystkimi terminami postoju (ten sam adres w kilka dni tygodnia) */
function VanDetails({
  address,
  stops,
  today,
  tomorrow,
}: {
  address: string;
  stops: BreadVanStop[];
  today: Weekday | null;
  tomorrow: Weekday | null;
}) {
  return (
    <>
      <p className="eyebrow text-[0.65rem]">Chlebowóz</p>
      <h3 className="heading mt-2 pr-8 text-xl">{address}</h3>
      <ul className="mt-4 space-y-1.5 text-sm">
        {stops.map((stop) => {
          const isToday = stop.dayOfTheWeek === today;
          const isTomorrow = stop.dayOfTheWeek === tomorrow;
          return (
            <li key={stop.id} className="flex items-center gap-3">
              {isToday && (
                <span className="bg-gold px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-[0.2em] text-ink">
                  Dziś
                </span>
              )}
              {isTomorrow && (
                <span className="border border-cream px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-[0.2em] text-cream">
                  Jutro
                </span>
              )}
              <span className="text-cream">{dayLabel(stop.dayOfTheWeek)}</span>
              <span className="font-display tracking-wider text-gold">
                {stop.startTime}–{stop.endTime}
              </span>
            </li>
          );
        })}
      </ul>
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
