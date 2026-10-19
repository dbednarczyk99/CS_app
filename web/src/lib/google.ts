import type { Location } from './api';

/** Link otwierający od razu okno „Napisz opinię” w Google dla danej piekarni */
export const reviewUrl = (placeId: string) =>
  `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;

export const ratingFormat = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * Ocena zbiorcza wszystkich piekarni: średnia WAŻONA liczbą opinii (piekarnia z 300 opiniami waży więcej niż
 * nowa z 5) i suma opinii. null – żadna piekarnia nie ma jeszcze oceny.
 */
export function ratingSummary(locations: Location[]) {
  const rated = locations.filter((l) => l.googleRating != null && (l.googleRatingCount ?? 0) > 0);
  const count = rated.reduce((sum, l) => sum + (l.googleRatingCount ?? 0), 0);
  if (count === 0) return null;
  const rating = rated.reduce((sum, l) => sum + l.googleRating! * l.googleRatingCount!, 0) / count;
  return { rating, count };
}
