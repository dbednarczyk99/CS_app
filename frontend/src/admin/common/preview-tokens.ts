import { useEffect, useState } from 'react';
import { useGetList } from 'react-admin';
import { apiUrl, httpClient } from '../../dataProvider';

type Rules = { cutoffTime: string; maxDaysAhead: number; maxActivePerPhone: number };

/** Polska odmiana: 1 piekarnia, 2–4 piekarnie, 5+ piekarni (jak na stronie) */
const plural = (n: number, [one, few, many]: [string, string, string]) => {
  if (n === 1) return one;
  const last = n % 10;
  const lastTwo = n % 100;
  return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? few : many;
};

/**
 * Znaczniki w podglądach jak na stronie: {godzina}, {dni}, {limit} – zasady z „Rezerwacje → Zasady rezerwacji”,
 * {piekarnie} – liczba piekarni (np. „4 piekarnie”). Do czasu wczytania – tekst bez zmian.
 */
export function usePreviewTokens() {
  const [rules, setRules] = useState<Rules | null>(null);
  const { total } = useGetList('contact/locations', { pagination: { page: 1, perPage: 1 } });

  useEffect(() => {
    httpClient(`${apiUrl}/settings/reservations/public`)
      .then(({ json }) => setRules(json as Rules))
      .catch(() => undefined);
  }, []);

  return (text?: string) => {
    if (!text) return text ?? '';
    let out = text;
    if (rules)
      out = out
        .replace(/\{godzina\}/g, rules.cutoffTime)
        .replace(/\{dni\}/g, `${rules.maxDaysAhead} ${plural(rules.maxDaysAhead, ['dzień', 'dni', 'dni'])}`)
        .replace(/\{limit\}/g, String(rules.maxActivePerPhone));
    if (typeof total === 'number')
      out = out.replace(/\{piekarnie\}/gi, `${total} ${plural(total, ['piekarnia', 'piekarnie', 'piekarni'])}`);
    return out;
  };
}
