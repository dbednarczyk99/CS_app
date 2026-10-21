'use client';

import type { ReactNode } from 'react';
import { FaMapLocationDot } from 'react-icons/fa6';
import { saveConsent, useConsent } from '@/lib/consent';

/**
 * Mapa Google tylko po zgodzie (gdy w panelu włączono „Mapa Google dopiero po zgodzie”).
 * Bez zgody: krótka informacja z przyciskiem „Pokaż mapę” i – jeśli podano – lista adresów zamiast mapy.
 */
export function MapConsentGate({
  required,
  notice,
  button,
  fallback,
  children,
  compact = false,
}: {
  required: boolean;
  notice: string;
  button: string;
  /** zamiennik mapy (lista adresów z linkami do Map Google) */
  fallback?: ReactNode;
  children: ReactNode;
  /** niższa ramka – mała mapa w formularzu rezerwacji */
  compact?: boolean;
}) {
  const consent = useConsent();
  if (!required || consent?.maps) return <>{children}</>;
  // przed odczytem decyzji (renderowanie na serwerze) – samo miejsce na mapę, bez migania
  if (consent === undefined)
    return <div className={compact ? 'h-[120px]' : 'h-[160px]'} aria-hidden />;

  return (
    <div>
      <div
        className={`flex flex-col items-start gap-4 border border-line bg-coal sm:flex-row sm:items-center ${compact ? 'p-4' : 'p-6'}`}
      >
        <FaMapLocationDot size={28} className="shrink-0 text-gold" aria-hidden />
        <p className="flex-1 text-sm leading-relaxed text-stone">{notice}</p>
        <button
          type="button"
          className="btn btn-outline shrink-0"
          onClick={() => saveConsent(true)}
        >
          {button}
        </button>
      </div>
      {fallback && <div className="mt-4">{fallback}</div>}
    </div>
  );
}
