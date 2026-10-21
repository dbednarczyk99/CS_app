'use client';

import { APIProvider, AdvancedMarker, Map as GoogleMap, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useMemo, useState } from 'react';
import { FaLocationCrosshairs, FaShop, FaTruck } from 'react-icons/fa6';
import { Pin } from './StoresMap';
import { MapLoadCounter } from './MapLoadCounter';
import { MapConsentGate } from './MapConsentGate';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
const KRAKOW = { lat: 50.0647, lng: 19.945 };
/** przy „Najbliżej mnie” mapa pokazuje klienta i tyle najbliższych punktów */
const NEAREST_ON_MAP = 3;

export interface PickupPoint {
  /** `STORE:<id>` / `VAN:<id>` – ten sam punkt w różne dni ma ten sam klucz */
  key: string;
  kind: 'STORE' | 'VAN';
  address: string;
  /** godziny otwarcia piekarni / postoju chlebowozu w wybranym dniu, np. 07:00–10:00 */
  hours: string;
  lat: number | null;
  lng: number | null;
}

type LatLng = { lat: number; lng: number };

const hasCoords = (p: PickupPoint): p is PickupPoint & LatLng => p.lat != null && p.lng != null;

/** Odległość w linii prostej (km) */
function distanceKm(a: LatLng, b: LatLng) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

/** „ul. Wileńska 4, 31-413 Kraków” → ulica + „31-413 Kraków”; „Rynek Podgórski, Kraków” → „Rynek Podgórski” + „Kraków” */
function splitAddress(address: string) {
  const at = address.lastIndexOf(',');
  return at < 0
    ? { street: address, city: '' }
    : { street: address.slice(0, at).trim(), city: address.slice(at + 1).trim() };
}

const formatDistance =(km: number) =>
  km < 1 ? `${Math.round(km * 10) * 100} m` : `${km.toFixed(1).replace('.', ',')} km`;

/**
 * Wybór punktu odbioru w danym dniu: mapa i lista (zsynchronizowane – pinezka zaznacza pozycję na liście
 * i odwrotnie). Lista działa też bez mapy (brak klucza Google, czytniki ekranu). „Najbliżej mnie”
 * sortuje listę według odległości od klienta.
 */
export function PickupPointPicker({
  points,
  value,
  onChange,
  heading,
  rememberedKey,
  mapEnabled = true,
  mapConsent,
}: {
  points: PickupPoint[];
  /** false – mapa wyłączona w panelu (zostaje sama lista punktów) */
  mapEnabled?: boolean;
  /** mapa Google dopiero po zgodzie na pliki cookie (panel: Elementy wspólne → Pliki cookie) */
  mapConsent?: { required: boolean; notice: string; button: string };
  value: string | null;
  onChange: (key: string) => void;
  /** np. „W piątek: 4 piekarnie i 1 postój chlebowozu” */
  heading: string;
  /** ostatnio wybrany punkt (zapamiętany w przeglądarce) – z dopiskiem na liście */
  rememberedKey?: string | null;
}) {
  const [me, setMe] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const list = useMemo(() => {
    const withDistance = points.map((point) => ({
      point,
      distance: me && hasCoords(point) ? distanceKm(me, point) : null,
    }));
    return me
      ? withDistance.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
      : withDistance;
  }, [points, me]);

  function locate() {
    if (!navigator.geolocation) {
      setGeoError('Twoja przeglądarka nie udostępnia lokalizacji.');
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMe({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocating(false);
      },
      () => {
        setGeoError('Nie udało się ustalić lokalizacji – sprawdź, czy przeglądarka ma na nią zgodę.');
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  }

  const onMap = points.filter(hasCoords);
  // przy lokalizacji: kadr na klienta i najbliższe punkty; bez niej – wszystkie punkty
  const framed = me
    ? [me, ...list.filter((i) => i.distance != null).slice(0, NEAREST_ON_MAP).map((i) => i.point as LatLng)]
    : onMap;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-sm text-stone first-letter:uppercase">{heading}</p>
        <button
          type="button"
          onClick={locate}
          disabled={locating}
          className="link-arrow inline-flex items-center gap-2 text-[0.7rem] disabled:opacity-60"
        >
          <FaLocationCrosshairs aria-hidden /> {locating ? 'Szukam…' : me ? 'Odśwież lokalizację' : 'Najbliżej mnie'}
        </button>
      </div>
      {geoError && (
        <p role="status" className="mb-3 text-sm text-red-200">
          {geoError}
        </p>
      )}

      {API_KEY && mapEnabled && onMap.length > 0 && (
        <MapConsentGate
          required={mapConsent?.required ?? false}
          notice={mapConsent?.notice ?? ''}
          button={mapConsent?.button ?? ''}
          compact
        >
          <div className="relative h-[220px] overflow-hidden border border-line bg-coal sm:h-[300px]">
            <APIProvider apiKey={API_KEY} language="pl" region="PL">
              <GoogleMap
                mapId={MAP_ID}
                colorScheme={MAP_ID === 'DEMO_MAP_ID' ? 'DARK' : 'LIGHT'}
                defaultCenter={KRAKOW}
                defaultZoom={12}
                gestureHandling="cooperative"
                disableDefaultUI
                zoomControl
                clickableIcons={false}
                className="size-full"
              >
                <FitBounds points={framed} />
                <MapLoadCounter source="rezerwacja" />
                {onMap.map((point) => (
                  <AdvancedMarker
                    key={point.key}
                    position={point}
                    onClick={() => onChange(point.key)}
                    zIndex={point.key === value ? 1000 : point.kind === 'STORE' ? 100 : 90}
                    title={`${point.kind === 'STORE' ? 'Piekarnia' : 'Chlebowóz'}: ${point.address}`}
                  >
                    <PointPin point={point} active={point.key === value} />
                  </AdvancedMarker>
                ))}
                {me && (
                  <AdvancedMarker position={me} zIndex={50} title="Twoja lokalizacja">
                    <span className="block size-4 rounded-full border-2 border-ink bg-cream shadow-[0_0_0_6px_rgb(201_163_106/0.35)]" />
                  </AdvancedMarker>
                )}
              </GoogleMap>
            </APIProvider>
          </div>
        </MapConsentGate>
      )}

      <div role="radiogroup" aria-label="Punkt odbioru" className="mt-3 grid gap-2">
        {list.map(({ point, distance }) => {
          const selected = point.key === value;
          const isStore = point.kind === 'STORE';
          const { street, city } = splitAddress(point.address);
          return (
            <button
              key={point.key}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(point.key)}
              className={`grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 border px-3 py-3 text-left transition-colors sm:gap-4 sm:px-4 ${
                selected ? 'border-gold bg-gold/10 text-cream' : 'border-line text-cream/85 hover:border-gold/60'
              }`}
            >
              <span
                className={`grid size-9 place-items-center border transition-colors ${
                  selected ? 'border-gold bg-gold text-ink' : 'border-line text-gold'
                }`}
              >
                {isStore ? <FaShop size={15} aria-hidden /> : <FaTruck size={15} aria-hidden />}
                <span className="sr-only">{isStore ? 'Piekarnia' : 'Chlebowóz'}</span>
              </span>
              <span className="min-w-0">
                <span className="block">{street}</span>
                {/* miasto, odległość, „ostatnio wybrany” – jedna drobna linia pod ulicą */}
                <span className="block text-xs text-stone">
                  {[
                    city,
                    distance != null && `${formatDistance(distance)} od Ciebie`,
                    point.key === rememberedKey && 'ostatnio wybrany',
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </span>
              <span className="font-display text-sm tabular-nums text-gold sm:text-base">{point.hours}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Pinezka jak na mapie piekarni: piekarnia złota, chlebowóz kremowy; wybrany punkt powiększony ze złotą obwódką */
function PointPin({ point, active }: { point: PickupPoint; active: boolean }) {
  const isStore = point.kind === 'STORE';
  return (
    <div className={`relative origin-bottom transition-transform duration-200 ease-out hover:scale-110 ${active ? 'scale-125' : ''}`}>
      <Pin
        fill={isStore ? 'var(--color-gold)' : 'var(--color-cream)'}
        stroke={active ? (isStore ? 'var(--color-cream)' : 'var(--color-gold)') : 'var(--color-ink)'}
        strokeWidth={active ? 3 : 1.5}
      />
      <span className="absolute left-1/2 top-[17px] -translate-x-1/2 -translate-y-1/2 text-ink">
        {isStore ? <FaShop size={14} /> : <FaTruck size={14} />}
      </span>
    </div>
  );
}

/** Kadr na podane punkty (zmiana dnia, lokalizacja klienta) */
function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap();
  const signature = points.map((p) => `${p.lat},${p.lng}`).join('|');
  useEffect(() => {
    if (!map || points.length === 0) return;
    if (points.length === 1) {
      map.setCenter(points[0]);
      map.setZoom(14);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    points.forEach((p) => bounds.extend(p));
    // pinezka (48 px) wystaje nad punkt – większy margines u góry
    map.fitBounds(bounds, { top: 64, right: 32, bottom: 24, left: 32 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, signature]);
  return null;
}
