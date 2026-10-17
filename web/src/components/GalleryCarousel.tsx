'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const INTERVAL_MS = 4000;
const COPIES = 5; // zdjęcia powielone 5× – środkowa kopia to „prawdziwa” pozycja, boczne pozwalają zapętlić (też przy szybkim klikaniu)
const MIDDLE = Math.floor(COPIES / 2);

/**
 * Galeria „Prosto z piekarni” w szerokości treści strony: 1 / 2 / 4 zdjęcia (telefon / tablet / komputer),
 * zawsze całe. Zapętlona w obie strony: po dojechaniu do kopii
 * zdjęć pozycja niezauważalnie wraca na oryginał. Przewija się co 4 s (pauza po najechaniu, bez automatu
 * przy prefers-reduced-motion), strzałki i gest palcem.
 */
export function GalleryCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const n = images.length;
  const viewport = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(1);
  const loop = n > visible;
  // pozycja w powielonej liście; start na początku środkowej kopii
  const [index, setIndex] = useState(MIDDLE * n);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchX = useRef<number | null>(null);

  // ile zdjęć mieści się w całości – z szerokości okna galerii i jednego zdjęcia
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = viewport.current;
    if (!el) return;
    const measure = () => {
      const item = el.querySelector('li');
      if (!item) return;
      const gap = parseFloat(getComputedStyle(el.firstElementChild as Element).columnGap) || 0;
      setVisible(Math.max(1, Math.round((el.clientWidth + gap) / (item.clientWidth + gap))));
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

  // po przewinięciu na kopię – skok bez animacji na to samo zdjęcie w środkowej kopii
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

  const slides = loop ? Array.from({ length: COPIES }, () => images).flat() : images;
  const position = loop ? index : 0;
  const current = ((index % n) + n) % n;

  // strzałki na zdjęciach (tablet/komputer)
  const overlayArrow =
    'absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center border border-cream/30 bg-ink/70 text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold sm:grid';
  // strzałki pod galerią (telefon) – bez tła, nie zasłaniają zdjęcia
  const rowArrow =
    'grid size-10 shrink-0 place-items-center text-cream/60 transition-colors hover:text-gold sm:hidden';

  return (
    <div
      // n zdjęć w szerokości treści (1 / 2 / 4); szerokość zdjęcia i krok przesunięcia liczone z niej
      className="relative mt-12 [--gap:0.75rem] [--n:1] sm:[--n:2] lg:[--n:4]"
      role="region"
      aria-roledescription="karuzela"
      aria-label="Zdjęcia z piekarni"
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
            {slides.map((image, i) => {
              const shown = i >= position && i < position + visible;
              return (
                <li
                  key={`${Math.floor(i / n)}-${image.src}`}
                  aria-hidden={!shown}
                  className="relative aspect-[3/4] w-[calc((100%-(var(--n)-1)*var(--gap))/var(--n))] shrink-0 overflow-hidden"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1280px) 300px, (min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </li>
              );
            })}
          </ul>
        </div>

        {/* strzałki wyśrodkowane względem zdjęć */}
        {loop && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Poprzednie zdjęcie"
              className={`${overlayArrow} left-3`}
            >
              <FaChevronLeft size={14} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Następne zdjęcie"
              className={`${overlayArrow} right-3`}
            >
              <FaChevronRight size={14} aria-hidden />
            </button>
          </>
        )}
      </div>

      {/* pod galerią: paski pozycji (jeden na zdjęcie), na telefonie po bokach strzałki */}
      {loop && (
        <div className="mt-4 flex items-center justify-center gap-2 sm:mt-6">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Poprzednie zdjęcie"
            className={rowArrow}
          >
            <FaChevronLeft size={13} aria-hidden />
          </button>
          <div className="flex gap-1.5" aria-hidden>
            {images.map((image, i) => (
              <span
                key={image.src}
                className={`h-0.5 w-5 transition-colors duration-500 sm:w-6 ${i === current ? 'bg-gold' : 'bg-cream/20'}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Następne zdjęcie"
            className={rowArrow}
          >
            <FaChevronRight size={13} aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
