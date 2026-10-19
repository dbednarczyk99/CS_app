'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/stats';

/** Wyświetlenie strony produktu – do zestawienia „Najczęściej oglądane produkty” w panelu (bez danych osobowych) */
export function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackEvent('product', productId);
  }, [productId]);
  return null;
}
