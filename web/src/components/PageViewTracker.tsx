'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { newsletterCampaign, pageKey, trackEvent, trafficSource } from '@/lib/stats';

// źródło liczymy raz na wczytanie strony (przejścia między podstronami nie zmieniają document.referrer)
let sourceCounted = false;

/** Odsłona przy każdym wejściu na podstronę (także przejściach bez przeładowania) + źródło wejścia */
export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    // podgląd wpisu z panelu – to nie odwiedziny strony
    if (pathname.startsWith('/podglad')) return;
    trackEvent('view', pageKey(pathname));
    if (!sourceCounted) {
      sourceCounted = true;
      const source = trafficSource();
      if (source) trackEvent('source', source);
      const campaign = newsletterCampaign();
      if (campaign) trackEvent('newsletter', campaign);
    }
  }, [pathname]);
  return null;
}
