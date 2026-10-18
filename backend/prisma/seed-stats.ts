import type { PrismaClient } from '@prisma/client';

/**
 * Fikcyjna historia statystyk (60 dni) – żeby panel „Statystyki” i zrzuty do dokumentacji nie były puste.
 * Wartości przybliżają szacunki z dokumentu 05-Koszty (scenariusz „Start”).
 */
export async function seedStats(prisma: PrismaClient, today: string) {
  await prisma.dailyStat.deleteMany();
  const pages: [string, number][] = [
    ['/', 0.34],
    ['/oferta', 0.2],
    ['/oferta/[produkt]', 0.12],
    ['/piekarnie', 0.1],
    ['/chlebowoz', 0.07],
    ['/rezerwacja', 0.06],
    ['/kontakt', 0.04],
    ['/aktualnosci', 0.03],
    ['/o-nas', 0.03],
    ['/aktualnosci/[wpis]', 0.01],
  ];
  // powtarzalna „losowość” – za każdym razem te same dane
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const rows: { date: string; metric: string; key: string; count: number }[] = [];
  for (let back = 59; back >= 0; back--) {
    const d = new Date(Date.parse(`${today}T12:00:00Z`) - back * 86400000);
    const date = d.toISOString().slice(0, 10);
    const weekday = d.getUTCDay();
    const weekend = weekday === 0 || weekday === 6 ? 1.35 : 1;
    const views = Math.round((140 + 60 * rand()) * weekend * (1 + (59 - back) / 120));
    for (const [key, share] of pages) {
      const count = Math.round(views * share * (0.8 + 0.4 * rand()));
      if (count) rows.push({ date, metric: 'view', key, count });
    }
    rows.push({ date, metric: 'map', key: 'piekarnie', count: Math.round(views * 0.1 * (0.8 + 0.4 * rand())) });
    rows.push({ date, metric: 'map', key: 'chlebowoz', count: Math.round(views * 0.07 * (0.8 + 0.4 * rand())) });
    rows.push({ date, metric: 'map', key: 'rezerwacja', count: Math.round(views * 0.05 * (0.8 + 0.4 * rand())) });
    rows.push({ date, metric: 'mail', key: 'rezerwacja', count: Math.round(5 + 6 * rand()) });
    if (rand() < 0.2) rows.push({ date, metric: 'mail', key: 'anulowanie', count: 1 });
    rows.push({ date, metric: 'mail', key: 'zestawienie', count: 1 });
    if (rand() < 0.5) rows.push({ date, metric: 'mail', key: 'kontakt', count: 1 });
    if (rand() < 0.3) rows.push({ date, metric: 'mail', key: 'newsletter-zapis', count: Math.round(1 + 2 * rand()) });
    // newsletter wysyłany dwa razy w miesiącu
    if (back % 15 === 3) rows.push({ date, metric: 'mail', key: 'newsletter', count: 180 + Math.round(30 * rand()) });
  }
  await prisma.dailyStat.createMany({ data: rows });
  return rows.length;
}
