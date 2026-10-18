'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { pageKey, trackEvent } from '@/lib/stats';

/** Odsłona przy każdym wejściu na podstronę (także przejściach bez przeładowania) */
export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    trackEvent('view', pageKey(pathname));
  }, [pathname]);
  return null;
}
