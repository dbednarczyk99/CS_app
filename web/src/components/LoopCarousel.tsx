'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const INTERVAL_MS = 4000;
const COPIES = 5; // elementy powielone 5× – środkowa kopia to „prawdziwa” pozycja, boczne pozwalają zapętlić (też przy szybkim klikaniu)
const MIDDLE = Math.floor(COPIES / 2);

/**
 * Zapętlona karuzela w szerokości kontenera: widać tyle elementów, ile mieści się w całości (liczba na
 * ekran z klas `perView`, np. „[--n:1] sm:[--n:2] lg:[--n:4]”). Po dojechaniu do kopii pozycja niezauważalnie
 * wraca na oryginał. Przewija się co 4 s (pauza po najechaniu/dotknięciu, bez automatu przy
 * prefers-reduced-motion), strzałki pod spodem (przy paskach pozycji) i gest palcem.
 */
export function LoopCarousel({
  items,
  label,
  perView,
  gap = '[--gap:0.75rem]',
}: {
  items: { key: string; node: ReactNode }[];
  label: string;
  perView: string;
  gap?: string;
}) {
  const n = items.length;
  const viewport = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(1);
  const loop = n > visible;
  // pozycja w powielonej liście; start na początku środkowej kopii
  const [index, setIndex] = useState(MIDDLE * n);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchX = useRef<number | null>(null);

  // ile elementów mieści się w całości – z szerokości okna karuzeli i jednego elementu
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = viewport.current;
    if (!el) return;
    const measure = () => {
      const item = el.querySelector('li');
      if (!item) return;
      const gapPx = parseFloat(getComputedStyle(el.firstElementChild as Element).columnGap) || 0;
      setVisible(Math.max(1, Math.round((el.clientWidth + gapPx) / (item.clientWidth + gapPx))));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /** Ta sama pozycja przeniesiona do środkowej kopii */
  const normalize = useCallback((i: number) => MIDDLE * n + (((i % n) + n) % n), [n]);

  const go = useCallback(
    (i: number) => {
      if (!loop) return;
      setAnimate(true);
      // bez animacji (ograniczenie ruchu) od razu na oryginał; szybkie klikanie nie wyjedzie poza kopie
      setIndex(reducedMotion ? normalize(i) : Math.min(Math.max(i, 0), COPIES * n - visible));
    },
    [loop, n, normalize, reducedMotion, visible],
  );

  // po przewinięciu na kopię – skok bez animacji na to samo miejsce w środkowej kopii
  const onTransitionEnd = () => {
    if (index >= MIDDLE * n && index < (MIDDLE + 1) * n) return;
    setAnimate(false);
    setIndex(normalize(index));
  };
  useEffect(() => {
    if (animate) return;
    // włączenie animacji dopiero po narysowaniu nowej pozycji
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  useEffect(() => {
    if (paused || !loop || reducedMotion) return;
    const timer = setInterval(() => go(index + 1), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, loop, reducedMotion, go, index]);

  const slides = loop ? Array.from({ length: COPIES }, () => items).flat() : items;
  const position = loop ? index : 0;
  const current = ((index % n) + n) % n;

  // strzałki pod karuzelą – bez tła, niczego nie zasłaniają
  const rowArrow = 'grid size-10 shrink-0 place-items-center text-cream/60 transition-colors hover:text-gold';

  return (
    <div
      // n elementów w szerokości kontenera; szerokość elementu i krok przesunięcia liczone z niej
      className={`relative ${gap} ${perView}`}
      role="region"
      aria-roledescription="karuzela"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="relative">
        <div ref={viewport} className="touch-pan-y overflow-hidden">
          <ul
            className={`flex gap-[var(--gap)] ease-out motion-reduce:transition-none ${
              animate ? 'transition-transform duration-700' : ''
            }`}
            // krok = (szerokość okna + odstęp) / n; procent liczony z szerokości listy (= okna)
            style={{ transform: `translateX(calc(${-position} * (100% + var(--gap)) / var(--n)))` }}
            onTransitionEnd={(e) => {
              if (e.target === e.currentTarget) onTransitionEnd();
            }}
          >
            {slides.map((item, i) => {
              const shown = i >= position && i < position + visible;
              return (
                <li
                  key={`${Math.floor(i / n)}-${item.key}`}
                  aria-hidden={!shown}
                  inert={!shown}
                  className="w-[calc((100%-(var(--n)-1)*var(--gap))/var(--n))] shrink-0"
                >
                  {item.node}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* pod karuzelą: paski pozycji (jeden na element) i strzałki po bokach */}
      {loop && (
        <div className="mt-4 flex items-center justify-center gap-2 sm:mt-6">
          <button type="button" onClick={() => go(index - 1)} aria-label="Poprzednie" className={rowArrow}>
            <FaChevronLeft size={13} aria-hidden />
          </button>
          <div className="flex gap-1.5" aria-hidden>
            {items.map((item, i) => (
              <span
                key={item.key}
                className={`h-0.5 w-5 transition-colors duration-500 sm:w-6 ${i === current ? 'bg-gold' : 'bg-cream/20'}`}
              />
            ))}
          </div>
          <button type="button" onClick={() => go(index + 1)} aria-label="Następne" className={rowArrow}>
            <FaChevronRight size={13} aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
