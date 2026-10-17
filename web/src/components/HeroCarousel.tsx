'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa6';
import type { BreadVanStop } from '@/lib/api';
import { WEEKDAYS, weekdayOf } from '@/lib/format';

const SLIDE_MS = 7000;

export interface HeroSlide {
  key: string;
  /** krótka nazwa pod paskiem postępu */
  name: string;
  eyebrow: string;
  title: string[];
  text: string;
  /** chlebowóz: najbliższy przystanek liczony w przeglądarce (dziś/jutro zależy od godziny) */
  vanStops?: BreadVanStop[];
  ctas: { href: string; label: string; primary?: boolean }[];
  image: { src: string; alt: string; position?: string };
  /** osobny kadr na telefon (pionowy) */
  mobileImage?: { src: string; position?: string };
}

/**
 * Hero strony głównej jako karuzela: zdjęcie i tekst zmieniają się razem co 7 s (przenikanie).
 * Pauza po najechaniu / fokusie / przyciskiem, przesuwanie palcem; przy prefers-reduced-motion
 * nie przewija się sama. Pierwszy slajd renderuje się po stronie serwera jak zwykły hero (LCP),
 * zdjęcia pozostałych ładują się dopiero po starcie strony.
 */
export function HeroCarousel({ slides, firstImage }: { slides: HeroSlide[]; firstImage: ReactNode }) {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // poprzedni slajd trzyma zbliżenie, dopóki się nie wygasi (bez skoku skali)
  const [previous, setPrevious] = useState<number | null>(null);
  const go = useCallback(
    (i: number) => {
      setPrevious(active);
      setActive((i + count) % count);
    },
    [active, count],
  );
  const autoplay = mounted && !reducedMotion && count > 1;
  const paused = userPaused || hovered || hidden;

  return (
    <section
      aria-roledescription="karuzela"
      aria-label="Najważniejsze informacje"
      // touch-pan-y: poziomy gest przełącza slajd zamiast cofać stronę w przeglądarce
      className="relative flex min-h-svh touch-pan-y items-end overflow-hidden pb-36 sm:items-center sm:pb-24"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
      }}
    >
      {/* ZDJĘCIA */}
      {slides.map((slide, i) => {
        const isActive = i === active;
        return (
          <div
            key={slide.key}
            aria-hidden
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* animacja zbliżenia startuje od nowa przy każdym pokazaniu slajdu (klasa zdejmowana po wygaszeniu) */}
            <div className={`absolute inset-0 ${isActive || i === previous ? 'animate-slow-zoom' : ''}`}>
              {i === 0
                ? firstImage
                : mounted && (
                    <>
                      <Image
                        src={slide.image.src}
                        alt=""
                        fill
                        sizes="100vw"
                        className={`object-cover ${slide.mobileImage ? 'hidden md:block' : ''}`}
                        style={{ objectPosition: slide.image.position }}
                      />
                      {slide.mobileImage && (
                        <Image
                          src={slide.mobileImage.src}
                          alt=""
                          fill
                          sizes="100vw"
                          className="object-cover md:hidden"
                          style={{ objectPosition: slide.mobileImage.position }}
                        />
                      )}
                    </>
                  )}
            </div>
          </div>
        );
      })}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20 md:bg-gradient-to-r md:from-ink/95 md:via-ink/60 md:to-transparent" />
      {/* przyciemnienie pod nawigacją – czytelna także na jasnych zdjęciach */}
      <div className="absolute inset-x-0 bottom-0 hidden h-48 bg-gradient-to-t from-ink/80 to-transparent md:block" />

      {/* TEKSTY – wszystkie w jednej komórce siatki, więc wysokość = najwyższy slajd */}
      <div className="relative mx-auto grid w-full max-w-7xl px-5 sm:px-8">
        {slides.map((slide, i) => {
          const isActive = i === active;
          const Heading = i === 0 ? 'h1' : 'h2';
          return (
            <div
              key={slide.key}
              role="group"
              aria-roledescription="slajd"
              aria-label={`${i + 1} z ${count}: ${slide.name}`}
              aria-hidden={!isActive}
              inert={!isActive}
              className={`col-start-1 row-start-1 max-w-xl self-end transition-all duration-700 ease-out sm:self-center ${
                isActive ? 'translate-y-0 opacity-100 delay-300' : 'pointer-events-none translate-y-4 opacity-0'
              }`}
            >
              <p className="eyebrow">{slide.eyebrow}</p>
              <Heading className="heading mt-5 text-5xl sm:text-6xl lg:text-7xl">
                {slide.title.map((line, l) => (
                  <span key={l} className="block">
                    {line}
                  </span>
                ))}
              </Heading>
              {slide.vanStops && <NextVanStop stops={slide.vanStops} />}
              <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/85">{slide.text}</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                {slide.ctas.map((cta) => (
                  <Link key={cta.href + cta.label} href={cta.href} className={`btn ${cta.primary ? 'btn-gold' : 'btn-outline'}`}>
                    {cta.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* NAWIGACJA: paski postępu z nazwami slajdów + pauza */}
      {count > 1 && (
        <div className="absolute inset-x-0 bottom-6 sm:bottom-8">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 sm:px-8">
            <ol className="flex flex-1 gap-2 sm:gap-4">
              {slides.map((slide, i) => {
                const isActive = i === active;
                return (
                  <li key={slide.key} className="flex-1">
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Slajd ${i + 1}: ${slide.name}`}
                      aria-current={isActive}
                      className="group block w-full py-3 text-left"
                    >
                      <span className="block h-0.5 overflow-hidden bg-cream/25">
                        <span
                          key={isActive ? `bar-${active}` : 'bar'}
                          className={`block h-full origin-left bg-gold ${
                            isActive ? (autoplay ? 'animate-hero-progress' : 'scale-x-100') : 'scale-x-0'
                          }`}
                          style={{
                            animationDuration: `${SLIDE_MS}ms`,
                            animationPlayState: paused ? 'paused' : 'running',
                          }}
                          onAnimationEnd={() => go(active + 1)}
                        />
                      </span>
                      <span
                        className={`mt-3 hidden font-display text-[0.7rem] uppercase tracking-[0.2em] transition-colors sm:block ${
                          isActive ? 'text-cream' : 'text-cream/50 group-hover:text-cream/80'
                        }`}
                      >
                        <span className="text-gold">{String(i + 1).padStart(2, '0')}</span> {slide.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            {autoplay && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? 'Wznów przewijanie' : 'Zatrzymaj przewijanie'}
                className="flex size-11 shrink-0 items-center justify-center border border-cream/40 bg-ink/40 text-cream/80 backdrop-blur-sm transition-colors hover:border-gold hover:text-gold sm:-mt-6"
              >
                {userPaused ? <FaPlay size={12} aria-hidden /> : <FaPause size={12} aria-hidden />}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Przystanki chlebowozu: dziś (jeśli jeszcze stoi) i jutro; gdy w te dni nie jeździ –
 * najbliższy kolejny dzień trasy. Liczone w przeglądarce (zależy od bieżącej godziny).
 */
function NextVanStop({ stops }: { stops: BreadVanStop[] }) {
  const [rows, setRows] = useState<{ when: string; stop: BreadVanStop }[]>([]);

  useEffect(() => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    const stopsOn = (d: number) => {
      const day = weekdayOf(new Date(now.getTime() + d * 24 * 60 * 60 * 1000));
      return {
        day,
        stops: stops
          .filter((s) => s.dayOfTheWeek === day && (d > 0 || s.endTime > time))
          .sort((a, b) => a.startTime.localeCompare(b.startTime)),
      };
    };
    const result = [
      ...stopsOn(0).stops.map((stop) => ({ when: 'Dziś', stop })),
      ...stopsOn(1).stops.map((stop) => ({ when: 'Jutro', stop })),
    ];
    if (result.length === 0) {
      for (let d = 2; d < 7; d++) {
        const next = stopsOn(d);
        if (next.stops.length > 0) {
          const label = WEEKDAYS.find((w) => w.key === next.day)!.label;
          result.push(...next.stops.map((stop) => ({ when: label, stop })));
          break;
        }
      }
    }
    setRows(result);
  }, [stops]);

  // miejsce na dwa wiersze zarezerwowane od razu, żeby tekst nie skakał po obliczeniu w przeglądarce
  return (
    <ul className="mt-6 min-h-16 space-y-2">
      {rows.map(({ when, stop }) => (
        <li
          key={when + stop.id}
          className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-lg uppercase tracking-[0.15em]"
        >
          <span
            className={`min-w-14 shrink-0 px-2 py-0.5 text-center text-[0.65rem] tracking-[0.2em] ${
              when === 'Dziś' ? 'bg-gold text-ink' : 'border border-cream/70 text-cream'
            }`}
          >
            {when}
          </span>
          <span className="shrink-0 tabular-nums text-gold">
            {stop.startTime}–{stop.endTime}
          </span>
          {/* na telefonie adres w osobnej linii pod godziną */}
          <span className="basis-full normal-case tracking-normal text-cream sm:basis-auto">{stop.address}</span>
        </li>
      ))}
    </ul>
  );
}
