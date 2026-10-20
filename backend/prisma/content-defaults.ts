/**
 * Generuje kopie wartości domyślnych dla strony (używane awaryjnie, gdy API nie odpowiada):
 * - web/src/lib/content-defaults.ts – treści sekcji (src/modules/content/sections.ts),
 * - web/src/lib/legal-defaults.ts – dokumenty prawne (content/prawne/*.md).
 * Uruchomić po zmianie domyślnych tekstów, dodaniu sekcji albo zmianie plików dokumentów:
 *   npm run content:defaults
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { SECTIONS } from '../src/modules/content/sections';
import {
  LEGAL_DOCS,
  legalDefault,
  type LegalDoc,
} from '../src/modules/settings/settings.service';

const web = join(__dirname, '../../web/src/lib');

const defaults = Object.fromEntries(SECTIONS.map((s) => [s.key, s.defaults]));
writeFileSync(
  join(web, 'content-defaults.ts'),
  `// Plik wygenerowany: npm run content:defaults (w backend) z backend/src/modules/content/sections.ts – nie edytować ręcznie.
// Domyślne treści strony – używane awaryjnie, gdy API nie odpowiada.
export const CONTENT_DEFAULTS = ${JSON.stringify(defaults, null, 2)};
`,
);

const legal = Object.fromEntries(
  (Object.keys(LEGAL_DOCS) as LegalDoc[]).map((doc) => [
    doc,
    { title: LEGAL_DOCS[doc].title, markdown: legalDefault(doc) },
  ]),
);
writeFileSync(
  join(web, 'legal-defaults.ts'),
  `// Plik wygenerowany: npm run content:defaults (w backend) z backend/content/prawne/*.md – nie edytować ręcznie.
// Domyślne dokumenty prawne – używane awaryjnie, gdy API nie odpowiada.
export const LEGAL_DEFAULTS: Record<string, { title: string; markdown: string }> = ${JSON.stringify(legal, null, 2)};
`,
);
console.log(
  `Zapisano ${SECTIONS.length} sekcji i ${Object.keys(legal).length} dokumenty → ${web}`,
);
