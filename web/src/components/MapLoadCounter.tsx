'use client';

import { useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/stats';

// mapy już policzone – każda instancja mapy Google raz (tak rozlicza Google), bez podwójnego liczenia
const counted = new WeakSet<google.maps.Map>();

/**
 * Wczytanie mapy Google – do licznika kosztów w panelu. Umieszczony wewnątrz <GoogleMap>,
 * liczy dopiero utworzoną mapę (gdy brak klucza albo mapa się nie wczyta – nic nie liczy).
 */
export function MapLoadCounter({ source }: { source: 'piekarnie' | 'chlebowoz' | 'rezerwacja' }) {
  const map = useMap();
  useEffect(() => {
    if (!map || counted.has(map)) return;
    counted.add(map);
    trackEvent('map', source);
  }, [map, source]);
  return null;
}
