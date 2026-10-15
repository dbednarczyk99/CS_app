'use client';

import Link from 'next/link';
import { FaBasketShopping } from 'react-icons/fa6';
import { useReservationCart } from '@/lib/reservation-cart';

/** Przycisk w nagłówku: „Rezerwacja” z liczbą wybranych produktów */
export function ReservationButton({ className = '' }: { className?: string }) {
  const { count, ready } = useReservationCart();
  const shown = ready ? count : 0;

  return (
    <Link
      href="/rezerwacja"
      className={`btn min-h-0 px-4 py-2.5 text-[0.75rem] ${shown > 0 ? 'btn-gold' : 'btn-outline'} ${className}`}
      aria-label={shown > 0 ? `Rezerwacja – ${shown} szt.` : 'Rezerwacja'}
    >
      <FaBasketShopping aria-hidden />
      <span className="hidden sm:inline">Rezerwacja</span>
      {shown > 0 && <span className="tabular-nums">· {shown}</span>}
    </Link>
  );
}
