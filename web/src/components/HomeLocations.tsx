import type { Location } from '@/lib/api';
import { LocationCard } from './LocationCard';
import { LoopCarousel } from './LoopCarousel';
import { Reveal } from './Reveal';

/** Tyle piekarni mieści się w jednym rzędzie na komputerze – więcej: karuzela */
export const MAX_IN_ROW = 4;

/** Kolumny siatki przy 1–4 kafelkach – zawsze pełna szerokość rzędu (klasy dosłownie – dla Tailwinda) */
export const GRID_COLUMNS: Record<number, string> = {
  1: 'mx-auto max-w-md',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

/**
 * Piekarnie na stronie głównej. Do 4 – siatka na całą szerokość (przy mniejszej liczbie kafelki się rozciągają,
 * jedna piekarnia – wyśrodkowana), powyżej 4 – automatyczna, zapętlona karuzela jak „Wypieki” i galeria.
 */
export function HomeLocations({ locations }: { locations: Location[] }) {
  if (locations.length > MAX_IN_ROW)
    return (
      <LoopCarousel
        label="Nasze piekarnie"
        perView="[--n:1] sm:[--n:2] lg:[--n:4]"
        gap="[--gap:1rem]"
        items={locations.map((location, i) => ({
          key: location.id,
          node: <LocationCard location={location} index={i} showHours={false} />,
        }))}
      />
    );
  return (
    <div className={`grid gap-4 ${GRID_COLUMNS[locations.length] ?? GRID_COLUMNS[4]}`}>
      {locations.map((location, i) => (
        <Reveal key={location.id} delay={i * 100} className="h-full">
          <LocationCard location={location} index={i} showHours={false} />
        </Reveal>
      ))}
    </div>
  );
}
