/**
 * Nagłówki dla zapytań strona → API w imieniu odwiedzającego: jego adres IP (do limitów w API)
 * potwierdzony wspólnym sekretem – API nie ufa adresowi podanemu bez sekretu.
 * Adres: X-Real-IP od serwera pośredniczącego (nginx), inaczej ostatni wpis X-Forwarded-For
 * (dopisany przez nasz serwer – wcześniejsze wpisy może podać sam klient).
 */
export function clientHeaders(request: Request): Record<string, string> {
  const realIp = request.headers.get('x-real-ip')?.trim();
  const forwarded = request.headers.get('x-forwarded-for')?.split(',').map((s) => s.trim()).filter(Boolean);
  const ip = realIp || forwarded?.at(-1) || '';
  const secret = process.env.INTERNAL_API_SECRET;
  return {
    ...(ip ? { 'X-Client-IP': ip } : {}),
    ...(secret ? { 'X-Internal-Secret': secret } : {}),
  };
}
