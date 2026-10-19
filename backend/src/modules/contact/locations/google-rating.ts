/**
 * Źródło oceny piekarni w Google (gwiazdki i liczba opinii). Jedno miejsce do podmiany: dziś Places API (New),
 * docelowo Google Business Profile API (oceny własnych wizytówek – po uzyskaniu dostępu od Google; opis
 * w dokumentacji dla właściciela, „Opinie Google”). Reszta aplikacji korzysta tylko z `fetchGoogleRating`.
 */
export type GoogleRating = { rating: number | null; count: number | null };

export type RatingResult =
  | { ok: true; value: GoogleRating }
  | { ok: false; reason: 'no-key' | 'error'; message: string };

/**
 * Places API (New), Place Details z polami `rating,userRatingCount` (SKU Place Details Enterprise – 1000 darmowych
 * zapytań miesięcznie; odświeżamy raz dziennie). Uwaga: warunki Google Maps Platform co do zasady nie pozwalają
 * przechowywać tych danych – świadoma decyzja właściciela na czas przejściowy (patrz dokumentacja).
 */
export async function fetchGoogleRating(
  placeId: string,
  apiKey: string | undefined,
): Promise<RatingResult> {
  if (!apiKey)
    return {
      ok: false,
      reason: 'no-key',
      message:
        'Brak klucza Google (GOOGLE_PLACES_API_KEY) w konfiguracji serwera – ocena nie może zostać pobrana.',
    };
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount',
        },
      },
    );
    if (!res.ok)
      return {
        ok: false,
        reason: 'error',
        message:
          res.status === 404 || res.status === 400
            ? 'Google nie zna takiego identyfikatora miejsca – sprawdź Place ID.'
            : `Google odrzuciło zapytanie (błąd ${res.status}) – sprawdź klucz i limity w Google Cloud.`,
      };
    const body = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
    };
    return {
      ok: true,
      value: {
        rating: body.rating ?? null,
        count: body.userRatingCount ?? null,
      },
    };
  } catch (error) {
    return {
      ok: false,
      reason: 'error',
      message: `Brak połączenia z Google: ${String(error)}`,
    };
  }
}
