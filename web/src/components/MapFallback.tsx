import { FaLocationArrow, FaMapLocationDot } from 'react-icons/fa6';

/**
 * Zamiast interaktywnej Mapy Google (wyłączonej w panelu albo po dziennym limicie wczytań): lista miejsc
 * z linkami do Map Google – działa bez kosztów po naszej stronie.
 */
export function MapFallback({ places }: { places: { key: string; label: string; detail?: string; href: string }[] }) {
  return (
    <div className="border border-line bg-coal p-6 sm:p-8">
      <p className="flex items-center gap-3 text-stone">
        <FaMapLocationDot aria-hidden className="shrink-0 text-gold" /> Mapa jest chwilowo niedostępna – każde miejsce
        otworzysz w Mapach Google.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {places.map((p) => (
          <li key={p.key}>
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full items-start justify-between gap-4 border border-line p-4 transition-colors hover:border-gold/60"
            >
              <span>
                <span className="block text-cream">{p.label}</span>
                {p.detail && <span className="mt-1 block text-sm text-stone">{p.detail}</span>}
              </span>
              <FaLocationArrow aria-hidden className="mt-1 shrink-0 text-gold transition-transform group-hover:translate-x-0.5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
