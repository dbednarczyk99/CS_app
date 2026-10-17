'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const INTERVAL_MS = 4000;
const COPIES = 5; // zdjęcia powielone 5× – środkowa kopia to „prawdziwa” pozycja, boczne pozwalają zapętlić (też przy szybkim klikaniu)
const MIDDLE = Math.floor(COPIES / 2);

/**
 * Galeria „Prosto z piekarni”: zdjęcia o stałej szerokości (telefon 70vw / tablet 38vw / komputer 22vw),
 * widać tylko te, które mieszczą się w całości (1 / 2 / 4). Zapętlona w obie strony: po dojechaniu do kopii
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

  const arrow =
    'absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center border border-cream/30 bg-ink/70 text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold';

  return (
    <div
      className="relative mx-auto mt-12 [--gap:0.75rem] [--item:70vw] [--n:1] sm:[--item:38vw] sm:[--n:2] lg:[--item:22vw] lg:[--n:4]"
      // szerokość okna = tyle zdjęć, ile mieści się w całości (reszta niewidoczna)
      style={{ width: 'calc(var(--n) * var(--item) + (var(--n) - 1) * var(--gap))' }}
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
            style={{ transform: `translateX(calc(${-position} * (var(--item) + var(--gap))))` }}
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
                  className="relative aspect-[3/4] w-[var(--item)] shrink-0 overflow-hidden"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 38vw, 70vw"
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
            <button type="button" onClick={() => go(index - 1)} aria-label="Poprzednie zdjęcie" className={`${arrow} left-3`}>
              <FaChevronLeft size={14} aria-hidden />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Następne zdjęcie" className={`${arrow} right-3`}>
              <FaChevronRight size={14} aria-hidden />
            </button>
          </>
        )}
      </div>

      {/* pozycja: cienkie paski pod galerią – jeden na zdjęcie, zaznaczone pierwsze widoczne */}
      {loop && (
        <div className="mt-6 flex justify-center gap-1.5" aria-hidden>
          {images.map((image, i) => (
            <span
              key={image.src}
              className={`h-0.5 w-6 transition-colors duration-500 ${i === current ? 'bg-gold' : 'bg-cream/20'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
