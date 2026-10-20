import { api, orFallback } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { LEGAL_DEFAULTS } from '@/lib/legal-defaults';
import { Markdown } from '@/lib/markdown';
import { getReservationRules } from '@/lib/reservation-rules';
import { fill, ruleTokens } from '@/lib/text';

/**
 * Dokument prawny z panelu (Strona → Dokumenty prawne); gdy API nie odpowiada – wersja domyślna
 * (backend/content/prawne, kopia w lib/legal-defaults.ts). Znaczniki {godzina}, {dni}, {limit} → aktualne zasady
 * rezerwacji z panelu, więc dokument zgadza się z formularzem.
 */
export async function LegalDocument({ doc }: { doc: 'regulamin' | 'polityka-prywatnosci' }) {
  const [data, rules] = await Promise.all([
    orFallback(api.legal(doc), { ...LEGAL_DEFAULTS[doc], updatedAt: null }),
    getReservationRules(),
  ]);
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-header sm:px-8">
      <Markdown source={fill(data.markdown, ruleTokens(rules))} />
      {data.updatedAt && (
        <p className="mt-12 border-t border-line pt-6 text-sm text-stone">
          Ostatnia zmiana dokumentu: {formatDate(data.updatedAt)}
        </p>
      )}
    </article>
  );
}
