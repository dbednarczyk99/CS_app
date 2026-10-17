'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaXmark } from 'react-icons/fa6';
import type { Announcement } from '@/lib/api';

const ROTATE_MS = 6000;
const STORAGE_KEY = 'baner-zamkniety';

/** Podpis zestawu komunikatów – nowy lub zmieniony komunikat pokaże się ponownie mimo zamknięcia */
export const announcementsSignature = (items: Announcement[]) =>
  items.map((a) => `${a.id}:${a.updatedAt}`).join('|');

export function wasDismissed(items: Announcement[]) {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === announcementsSignature(items);
  } catch {
    return false;
  }
}

/**
 * Wąski złoty pasek pod nawigacją (część stałego nagłówka, widoczny także po przewinięciu). Kilka komunikatów zmienia się co 6 s
 * (pauza po najechaniu, bez automatu przy prefers-reduced-motion). Zamknięcie krzyżykiem
 * obowiązuje do końca wizyty (sessionStorage).
 */
export function AnnouncementBar({
  items,
  collapsed,
  onDismiss,
}: {
  items: Announcement[];
  collapsed: boolean;
  onDismiss: () => void;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (count < 2 || paused || collapsed) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(timer);
  }, [count, paused, collapsed]);

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, announcementsSignature(items));
    } catch {
      // bez pamięci przeglądarki baner zniknie tylko do odświeżenia strony
    }
    onDismiss();
  };

  return (
    <div
      // wysokość z --banner-h (globals.css); zwinięty tylko przy otwartym menu mobilnym
      style={{ height: collapsed ? 0 : 'var(--banner-h)' }}
      className="overflow-hidden bg-gold text-ink transition-[height] duration-300 ease-out"
      aria-hidden={collapsed}
      inert={collapsed}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-5 sm:px-8">
        {count > 1 && (
          <button
            type="button"
            onClick={() => setActive((i) => (i - 1 + count) % count)}
            aria-label="Poprzedni komunikat"
            className="hidden size-7 shrink-0 place-items-center transition-opacity hover:opacity-60 sm:grid"
          >
            <FaChevronLeft size={11} />
          </button>
        )}

        {/* wszystkie komunikaty w jednej komórce siatki – przenikanie bez skakania wysokości */}
        <div role="region" aria-label="Komunikaty" aria-live="polite" className="grid min-w-0 flex-1">
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <div
                key={item.id}
                aria-hidden={!isActive}
                inert={!isActive}
                className={`col-start-1 row-start-1 flex min-w-0 items-center justify-center transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                {/* z linkiem cały komunikat jest klikalny; na telefonie zamiast napisu sama strzałka */}
                <BannerContent item={item} />
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <button
            type="button"
            onClick={() => setActive((i) => (i + 1) % count)}
            aria-label="Następny komunikat"
            className="hidden size-7 shrink-0 place-items-center transition-opacity hover:opacity-60 sm:grid"
          >
            <FaChevronRight size={11} />
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Zamknij komunikat"
          className="-mr-2 grid size-8 shrink-0 place-items-center transition-opacity hover:opacity-60"
        >
          <FaXmark size={15} />
        </button>
      </div>
    </div>
  );
}

function BannerContent({ item }: { item: Announcement }) {
  const message = (
    <span className="line-clamp-3 min-w-0 text-[0.8rem] leading-snug sm:line-clamp-1 sm:text-sm">{item.message}</span>
  );
  if (!item.linkUrl) return message;

  const className = 'group flex min-w-0 items-center gap-x-4';
  const content = (
    <>
      {message}
      {/* obramowany przycisk, po najechaniu wypełniony; na telefonie kwadrat z samą strzałką */}
      <span className="inline-flex size-8 shrink-0 items-center justify-center gap-2 border border-ink font-display text-[0.7rem] uppercase tracking-[0.2em] transition-colors group-hover:bg-ink group-hover:text-gold-light sm:size-auto sm:px-3 sm:py-1">
        <span className="hidden sm:inline">{item.linkLabel || 'Dowiedz się więcej'}</span>
        <FaArrowRight size={11} aria-hidden />
      </span>
    </>
  );
  // link do podstrony piekarni w tej samej karcie, zewnętrzny – w nowej
  return item.linkUrl.startsWith('/') ? (
    <Link href={item.linkUrl} className={className}>
      {content}
    </Link>
  ) : (
    <a href={item.linkUrl} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  );
}
