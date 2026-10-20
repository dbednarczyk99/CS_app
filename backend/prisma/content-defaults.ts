/**
 * Generuje web/src/lib/content-defaults.ts – kopię domyślnych treści strony (z src/modules/content/sections.ts),
 * której strona używa awaryjnie, gdy API nie odpowiada. Uruchomić po zmianie domyślnych tekstów lub dodaniu sekcji:
 *   npm run content:defaults
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { SECTIONS } from '../src/modules/content/sections';

const defaults = Object.fromEntries(SECTIONS.map((s) => [s.key, s.defaults]));
const target = join(__dirname, '../../web/src/lib/content-defaults.ts');

writeFileSync(
  target,
  `// Plik wygenerowany: npm run content:defaults (w backend) z backend/src/modules/content/sections.ts – nie edytować ręcznie.
// Domyślne treści strony – używane awaryjnie, gdy API nie odpowiada.
export const CONTENT_DEFAULTS = ${JSON.stringify(defaults, null, 2)};
`,
);
console.log(`Zapisano ${SECTIONS.length} sekcji → ${target}`);
