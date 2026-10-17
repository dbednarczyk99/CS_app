'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const INTERVAL_MS = 4000;

/**
 * Galeria „Prosto z piekarni”: zdjęcia o stałej szerokości (telefon 70vw / tablet 38vw / komputer 22vw),
 * widać tylko te, które mieszczą się w całości (1 / 2 / 4). Przewija się co 4 s o jedno zdjęcie
 * (pauza po najechaniu, bez automatu przy prefers-reduced-motion), strzałki i gest palcem.
 */
export function GalleryCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(1);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const maxIndex = Math.max(0, images.length - visible);

  // ile zdjęć mieści się w całości – z szerokości okna galerii i jednego zdjęcia
  useEffect(() => {
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

  useEffect(() => setIndex((i) => Math.min(i, maxIndex)), [maxIndex]);

  // na końcu wraca do początku (i odwrotnie)
  const go = useCallback(
    (i: number) => setIndex(i > maxIndex ? 0 : i < 0 ? maxIndex : i),
    [maxIndex],
  );

  useEffect(() => {
    if (paused || maxIndex === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setIndex((i) => (i >= maxIndex ? 0 : i + 1)), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, maxIndex]);

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
            className="flex gap-[var(--gap)] transition-transform duration-700 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(calc(${-index} * (var(--item) + var(--gap))))` }}
          >
            {images.map((image, i) => {
              const shown = i >= index && i < index + visible;
              return (
                <li
                  key={image.src}
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
        {maxIndex > 0 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Poprzednie zdjęcia"
              className={`${arrow} left-3`}
            >
              <FaChevronLeft size={14} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Następne zdjęcia"
              className={`${arrow} right-3`}
            >
              <FaChevronRight size={14} aria-hidden />
            </button>
          </>
        )}
      </div>

      {maxIndex > 0 && (
        <>
          {/* pozycja: cienkie paski pod galerią */}
          <div className="mt-6 flex justify-center gap-1.5" aria-hidden>
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <span
                key={i}
                className={`h-0.5 w-6 transition-colors duration-500 ${i === index ? 'bg-gold' : 'bg-cream/20'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
