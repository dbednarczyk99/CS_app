'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { pageKey, trackEvent, trafficSource } from '@/lib/stats';

// źródło liczymy raz na wczytanie strony (przejścia między podstronami nie zmieniają document.referrer)
let sourceCounted = false;

/** Odsłona przy każdym wejściu na podstronę (także przejściach bez przeładowania) + źródło wejścia */
export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    trackEvent('view', pageKey(pathname));
    if (!sourceCounted) {
      sourceCounted = true;
      const source = trafficSource();
      if (source) trackEvent('source', source);
    }
  }, [pathname]);
  return null;
}
