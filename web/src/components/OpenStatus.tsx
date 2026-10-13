'use client';

import { useEffect, useState } from 'react';
import type { OpeningHours } from '@/lib/api';
import { hoursFor, weekdayOf } from '@/lib/format';

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
};

/** Znaczek „Otwarte teraz / Zamknięte” – liczony w przeglądarce, żeby nie był nieaktualny z cache */
export function OpenStatus({ hours }: { hours: OpeningHours | null }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!hours || !now) return null;

  const today = hoursFor(hours, weekdayOf(now));
  const minutes = now.getHours() * 60 + now.getMinutes();
  const open = today !== null && minutes >= toMinutes(today[0]) && minutes < toMinutes(today[1]);

  return (
    <span className="inline-flex items-center gap-2 font-display text-[0.7rem] uppercase tracking-[0.25em]">
      <span className={`size-2 rounded-full ${open ? 'bg-emerald-400' : 'bg-stone/60'}`} aria-hidden />
      <span className={open ? 'text-emerald-300' : 'text-stone'}>
        {open ? `Otwarte do ${today![1]}` : 'Teraz zamknięte'}
      </span>
    </span>
  );
}
