'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const INTERVAL_MS = 5000;

/**
 * Zdjęcia przenikające się co kilka sekund. Zatrzymuje się po najechaniu / fokusie,
 * przy prefers-reduced-motion nie przewija się sama (zostają kropki).
 * `offset` przesuwa start, żeby sąsiednie karty nie zmieniały zdjęć jednocześnie.
 */
export function PhotoCarousel({
  images,
  alt,
  sizes,
  offset = 0,
  className = 'aspect-[4/3]',
}: {
  images: { id: string; imgUrl: string }[];
  alt: string;
  sizes: string;
  offset?: number;
  /** proporcje / wymiary kontenera */
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      setActive((i) => (i + 1) % count);
      interval = setInterval(() => setActive((i) => (i + 1) % count), INTERVAL_MS);
    }, INTERVAL_MS + offset);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [count, paused, offset]);

  if (count === 0) return null;

  return (
    <div
      className={`relative overflow-hidden bg-graphite ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {images.map((image, i) => (
        <Image
          key={image.id}
          src={image.imgUrl}
          alt={count > 1 ? `${alt} – zdjęcie ${i + 1} z ${count}` : alt}
          fill
          sizes={sizes}
          aria-hidden={i !== active}
          className={`object-cover transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-coal/80 to-transparent" />
      {count > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-1">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Pokaż zdjęcie ${i + 1}`}
              aria-current={i === active}
              className="group flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all ${
                  i === active ? 'w-5 bg-gold' : 'w-1.5 bg-cream/60 group-hover:bg-cream'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
