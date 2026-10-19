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
 * Komunikat dla panelu z odpowiedzi Google. Ten sam kod (400) Google zwraca i przy złym kluczu, i przy złym
 * identyfikatorze miejsca – rozróżniamy po treści błędu (reason / status / message).
 */
function errorMessage(status: number, body: string) {
  const text = body.toLowerCase();
  if (text.includes('api_key_invalid') || text.includes('api key not valid'))
    return 'Klucz Google jest nieprawidłowy albo został usunięty – wpisz aktualny klucz w konfiguracji serwera i uruchom serwer ponownie.';
  if (
    status === 403 ||
    text.includes('permission_denied') ||
    text.includes('api_key_service_blocked')
  )
    return 'Klucz Google nie ma dostępu do Places API (New) – sprawdź ograniczenia klucza i czy API jest włączone w Google Cloud.';
  if (status === 429 || text.includes('resource_exhausted'))
    return 'Przekroczono limit zapytań w Google Cloud – ocena odświeży się po odnowieniu limitu.';
  if (status === 404 || text.includes('not_found') || text.includes('place id'))
    return 'Google nie zna takiego identyfikatora miejsca – sprawdź Place ID (zaczyna się od „ChIJ”).';
  return `Google odrzuciło zapytanie (błąd ${status}) – sprawdź klucz i ustawienia w Google Cloud.`;
}

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
        message: errorMessage(res.status, await res.text().catch(() => '')),
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
