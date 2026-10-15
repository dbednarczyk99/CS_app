'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { PublicReservation } from '@/lib/api';
import { formatDay, formatPrice } from '@/lib/format';

const STATUS: Record<PublicReservation['status'], string> = {
  NEW: 'Przyjęta',
  READY: 'Gotowa do odbioru',
  PICKED_UP: 'Odebrana',
  NO_SHOW: 'Nieodebrana',
  CANCELLED: 'Anulowana',
};

export function CancelReservation({ token, initial }: { token: string; initial: PublicReservation }) {
  const [reservation, setReservation] = useState(initial);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const r = reservation;

  async function cancel() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/rezerwacje/anuluj/${encodeURIComponent(token)}`, { method: 'POST' });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.message ?? 'Nie udało się anulować rezerwacji.');
        return;
      }
      setReservation(body as PublicReservation);
    } catch {
      setError('Brak połączenia. Spróbuj ponownie.');
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  return (
    <div className="border border-line bg-coal p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-display text-2xl tracking-[0.15em] text-gold">{r.number}</p>
        <span
          className={`border px-2.5 py-1 font-display text-[0.7rem] uppercase tracking-[0.2em] ${
            r.status === 'CANCELLED' ? 'border-stone/50 text-stone' : 'border-gold/60 text-gold'
          }`}
        >
          {STATUS[r.status]}
        </span>
      </div>

      <p className="mt-6 text-lg first-letter:uppercase">
        {formatDay(r.pickupDate)}
        {r.pickupTime ? `, ${r.pickupTime}` : ''}
      </p>
      <p className="text-stone">
        {r.pickupType === 'VAN' ? 'Chlebowóz' : 'Piekarnia'}: {r.pickupLabel}
      </p>

      <ul className="mt-6 space-y-1 border-t border-line pt-4 text-sm">
        {r.items.map((i) => (
          <li key={i.productName} className="flex justify-between gap-4">
            <span>
              {i.productName} <span className="text-stone">× {i.quantity}</span>
            </span>
            <span className="tabular-nums">{formatPrice(Number(i.unitPrice) * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex justify-between border-t border-line pt-3">
        <span className="text-stone">Razem</span>
        <span className="font-display text-gold">{formatPrice(Number(r.total))}</span>
      </p>

      <div className="mt-8">
        {r.status === 'CANCELLED' ? (
          <p className="text-lg">Rezerwacja została anulowana. Do zobaczenia następnym razem!</p>
        ) : r.canCancel ? (
          confirming ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="w-full text-stone">Na pewno anulować tę rezerwację?</p>
              <button type="button" onClick={cancel} disabled={busy} className="btn btn-gold disabled:opacity-60">
                {busy ? 'Anulowanie…' : 'Tak, anuluj'}
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="btn btn-outline">
                Nie, zostaw
              </button>
            </div>
          ) : (
            <>
              <button type="button" onClick={() => setConfirming(true)} className="btn btn-outline">
                Anuluj rezerwację
              </button>
              <p className="mt-3 text-sm text-stone">
                Możliwe do {formatDay(r.cancelDeadline.date)}, {r.cancelDeadline.hour}.
              </p>
            </>
          )
        ) : (
          <p className="text-stone">
            Tej rezerwacji nie można już anulować online (termin minął {formatDay(r.cancelDeadline.date)} o{' '}
            {r.cancelDeadline.hour}). Jeśli nie możesz jej odebrać, zadzwoń do piekarni.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-red-200">
            {error}
          </p>
        )}
      </div>

      <Link href="/" className="link-arrow mt-10 inline-block text-[0.75rem]">
        Strona główna
      </Link>
    </div>
  );
}
