'use client';

import { useEffect, useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import type { BreadVanStop, Weekday } from '@/lib/api';
import { WEEKDAYS, weekdayOf } from '@/lib/format';

/** Tygodniowa trasa chlebowozu z wyróżnionym dniem dzisiejszym */
export function VanSchedule({ stops }: { stops: BreadVanStop[] }) {
  const [today, setToday] = useState<Weekday | null>(null);
  const [tomorrow, setTomorrow] = useState<Weekday | null>(null);
  useEffect(() => {
    const now = new Date();
    setToday(weekdayOf(now));
    setTomorrow(weekdayOf(new Date(now.getTime() + 24 * 60 * 60 * 1000)));
  }, []);

  return (
    <ol className="divide-y divide-line border-y border-line">
      {WEEKDAYS.map((day) => {
        const dayStops = stops.filter((stop) => stop.dayOfTheWeek === day.key);
        const isToday = today === day.key;
        return (
          <li
            key={day.key}
            className={`grid gap-2 px-4 py-5 sm:grid-cols-[10rem_1fr] sm:items-center sm:px-6 ${
              isToday ? 'bg-gold/10' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`heading text-lg ${isToday ? 'text-gold' : ''}`}>{day.label}</span>
              {isToday && (
                <span className="bg-gold px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-[0.2em] text-ink">
                  Dziś
                </span>
              )}
              {tomorrow === day.key && (
                <span className="border border-cream/70 px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-[0.2em] text-cream">
                  Jutro
                </span>
              )}
            </div>
            {dayStops.length === 0 ? (
              <p className="text-stone">Chlebowóz odpoczywa</p>
            ) : (
              <ul className="space-y-2">
                {dayStops.map((stop) => (
                  <li key={stop.id} className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                    <span className="font-display tabular-nums tracking-wider text-gold">
                      {stop.startTime}–{stop.endTime}
                    </span>
                    <a
                      href={stop.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                    >
                      <FaLocationDot className="text-stone" aria-hidden /> {stop.address}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
