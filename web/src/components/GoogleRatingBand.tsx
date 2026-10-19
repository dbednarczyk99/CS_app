import { FaArrowRight, FaStar } from 'react-icons/fa6';
import type { Location } from '@/lib/api';
import { plural } from '@/lib/format';
import { ratingFormat, ratingSummary, reviewUrl } from '@/lib/google';

/** Pięć gwiazdek z częściowym wypełnieniem (np. 4,5 = cztery i pół) */
function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  const row = (className: string) => (
    // w-max + shrink-0: złota warstwa przycięta do części szerokości nie ściska gwiazdek
    <span className={`flex w-max gap-1 ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar key={i} size={size} aria-hidden className="shrink-0" />
      ))}
    </span>
  );
  return (
    <span className="relative inline-flex" aria-hidden>
      {row('text-cream/15')}
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${percent}%` }}>
        {row('text-gold')}
      </span>
    </span>
  );
}

/** „ul. Józefa Chełmońskiego 116, 31-348 Kraków” → „Chełmońskiego 116” (bez imienia patrona – krócej na telefonie) */
const shortStreet = (address: string) => {
  const words = address.split(',')[0].replace(/^ul\.\s*/i, '').split(/\s+/);
  // numer zawsze w jednej linii z ulicą (twarda spacja)
  return (words.length > 2 ? words.slice(-2) : words).join(' ');
};

/** Nazwa na karcie: skrócona ulica (pole „Nazwa” w panelu bywa wspólne dla wszystkich piekarni – nie odróżnia ich) */
const bakeryLabel = (location: Location) => shortStreet(location.address);

/**
 * Pasek z oceną w Google na stronie głównej: ocena zbiorcza (średnia ważona liczbą opinii) i kafelki piekarni –
 * każdy prowadzi do wystawienia opinii o tej piekarni. Same oceny, bez treści opinii (cytaty – po przejściu
 * na Google Business Profile API). Bez żadnej oceny – sekcji nie ma.
 */
export function GoogleRatingBand({
  locations,
  eyebrow = 'Opinie naszych gości',
  cta = 'Byłeś u nas? Oceń swoją piekarnię w Google',
}: {
  locations: Location[];
  /** teksty z panelu (Strona → Strona główna → Opinie w Google) */
  eyebrow?: string;
  cta?: string;
}) {
  const summary = ratingSummary(locations);
  const bakeries = locations.filter((l) => l.googlePlaceId);
  if (!summary || bakeries.length === 0) return null;

  return (
    <section aria-labelledby="opinie-google" className="border-y border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-center lg:gap-16">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="opinie-google" className="sr-only">
            Ocena w Google
          </h2>
          <div className="mt-5 flex items-end gap-4">
            <span className="font-display text-7xl leading-none text-cream">{ratingFormat.format(summary.rating)}</span>
            <div className="pb-1.5">
              <Stars rating={summary.rating} size={20} />
              <p className="mt-2 text-sm text-stone">
                średnio z {summary.count} opinii w Google
              </p>
            </div>
          </div>
          <p className="sr-only">
            Średnia ocena {ratingFormat.format(summary.rating)} na 5 z {summary.count} opinii w Google.
          </p>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-cream/85">
            {cta}
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {bakeries.map((location) => {
              const count = location.googleRatingCount ?? 0;
              return (
                <li key={location.id}>
                  <a
                    href={reviewUrl(location.googlePlaceId!)}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full flex-col border border-line bg-coal p-3.5 transition-colors hover:border-gold/60 sm:p-4"
                  >
                    {/* ocena na górze (stała wysokość), nazwa pod nią – długa nazwa nie rozjeżdża kart */}
                    {location.googleRating != null && count > 0 ? (
                      <span className="flex items-baseline gap-2">
                        <FaStar aria-hidden className="self-center text-gold" />
                        <span className="font-display text-2xl leading-none text-cream">
                          {ratingFormat.format(location.googleRating)}
                        </span>
                        <span className="text-xs text-stone">
                          {count} {plural(count, ['opinia', 'opinie', 'opinii'])}
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm text-stone">Bądź pierwszy</span>
                    )}
                    <span className="mt-2 text-sm leading-snug text-cream/90">{bakeryLabel(location)}</span>
                    <span className="link-arrow mt-auto inline-flex items-center gap-2 pt-3 text-[0.7rem]">
                      Oceń <FaArrowRight aria-hidden />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
