import { useEffect } from 'react';
import { useGetIdentity } from 'react-admin';
import { useLocation } from 'react-router-dom';

/**
 * „Szybkie akcje” na pulpicie, które same się uczą: panel liczy (w przeglądarce, osobno dla każdego konta), jak
 * często otwierasz dany ekran – z pulpitu czy z menu – i pokazuje najczęściej używane. Bez historii – kolejność
 * domyślna (jak na liście poniżej).
 */
export type QuickActionId =
  | 'product-new'
  | 'article-new'
  | 'banner'
  | 'van'
  | 'stats'
  | 'reservations'
  | 'preparation'
  | 'products'
  | 'scheduled'
  | 'carousel'
  | 'subscribers'
  | 'home-content';

/** Akcje w kolejności domyślnej; `owner` – tylko administrator; `match` – adresy, które liczą się jako użycie */
export const QUICK_ACTIONS: { id: QuickActionId; to: string; owner?: boolean; match: (path: string) => boolean }[] = [
  { id: 'product-new', to: '/products/create', match: (p) => p === '/products/create' },
  { id: 'article-new', to: '/blog/create', match: (p) => p === '/blog/create' },
  { id: 'banner', to: '/announcements', match: (p) => p.startsWith('/announcements') },
  { id: 'van', to: '/bread-van/locations', match: (p) => p.startsWith('/bread-van') },
  { id: 'stats', to: '/statystyki', match: (p) => p === '/statystyki' },
  { id: 'reservations', to: '/reservations', owner: true, match: (p) => p.startsWith('/reservations') },
  { id: 'preparation', to: '/przygotowanie', owner: true, match: (p) => p === '/przygotowanie' },
  { id: 'products', to: '/products', match: (p) => p === '/products' || /^\/products\/[^/]+$/.test(p) && !/^\/products\/(create|categories|labels)$/.test(p) },
  { id: 'scheduled', to: '/marketing/zaplanowane', match: (p) => p === '/marketing/zaplanowane' },
  { id: 'carousel', to: '/content/hero-slides', match: (p) => p.startsWith('/content/hero-slides') },
  { id: 'subscribers', to: '/newsletter', match: (p) => p === '/newsletter' },
  { id: 'home-content', to: '/strona/glowna', match: (p) => p === '/strona/glowna' },
];

const PREFIX = 'chleba-smak:szybkie-akcje:';

const load = (key: string): Partial<Record<QuickActionId, number>> => {
  try {
    const data = JSON.parse(localStorage.getItem(key) ?? '{}');
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
};

/** Liczy wejścia na ekrany z listy akcji – raz w układzie panelu (AdminLayout) */
export function useTrackQuickActions() {
  const { pathname } = useLocation();
  const { identity } = useGetIdentity();
  const key = identity?.id ? PREFIX + identity.id : null;
  useEffect(() => {
    if (!key) return;
    const action = QUICK_ACTIONS.find((a) => a.match(pathname));
    if (!action) return;
    const counts = load(key);
    counts[action.id] = (counts[action.id] ?? 0) + 1;
    try {
      localStorage.setItem(key, JSON.stringify(counts));
    } catch {
      // brak localStorage – kolejność domyślna
    }
  }, [pathname, key]);
}

/** Najczęściej używane akcje (stabilnie: przy remisie kolejność domyślna) */
export function topQuickActions(userId: string | number | undefined, isOwner: boolean, count: number) {
  const counts = userId ? load(PREFIX + userId) : {};
  return QUICK_ACTIONS.filter((a) => isOwner || !a.owner)
    .map((a, i) => ({ ...a, uses: counts[a.id] ?? 0, order: i }))
    .sort((a, b) => b.uses - a.uses || a.order - b.order)
    .slice(0, count);
}
