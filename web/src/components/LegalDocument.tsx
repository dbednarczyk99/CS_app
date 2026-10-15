import { readFile } from 'fs/promises';
import { join } from 'path';
import { Markdown } from '@/lib/markdown';

/** Dokument prawny z web/content/prawne/<file>.md – jedno źródło treści dla strony i dla prawnika */
export async function LegalDocument({ file }: { file: string }) {
  const source = await readFile(join(process.cwd(), 'content', 'prawne', file), 'utf8');
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <Markdown source={source} />
    </article>
  );
}
