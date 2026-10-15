import { Fragment, type ReactNode } from 'react';

/**
 * Minimalny renderer Markdown dla dokumentów prawnych (content/prawne/*.md):
 * nagłówki #–###, akapity, cytaty >, listy - i 1. (zagnieżdżone wcięciem), tabele |…|, --- ,
 * **pogrubienie**, adresy URL oraz pola do uzupełnienia [[…]] (wyróżnione).
 * Treść pochodzi z repozytorium (nie od użytkowników), a React i tak escapuje tekst.
 */

type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'hr' }
  | { type: 'table'; rows: string[][] }
  | { type: 'list'; ordered: boolean; items: { text: string; children: Block[] }[] };

const LIST_ITEM = /^(\s*)([-*]|\d+\.)\s+(.*)$/;
const indentOf = (line: string) => line.match(/^\s*/)![0].length;

function parse(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      i++;
      continue;
    }
    const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length as 1 | 2 | 3, text: heading[2] });
      i++;
      continue;
    }
    if (trimmed === '---') {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }
    if (trimmed.startsWith('>')) {
      const text: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) text.push(lines[i++].trim().replace(/^>\s?/, ''));
      blocks.push({ type: 'quote', text: text.join(' ') });
      continue;
    }
    if (trimmed.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = lines[i++].trim();
        if (/^\|[\s:|-]+\|$/.test(row)) continue; // separator
        rows.push(row.slice(1, -1).split('|').map((c) => c.trim()));
      }
      blocks.push({ type: 'table', rows });
      continue;
    }
    const item = line.match(LIST_ITEM);
    if (item) {
      const base = item[1].length;
      const ordered = /\d/.test(item[2]);
      const items: { text: string; children: Block[] }[] = [];
      while (i < lines.length) {
        const m = lines[i].match(LIST_ITEM);
        if (!m || m[1].length !== base || /\d/.test(m[2]) !== ordered) break;
        i++;
        // wszystko bardziej wcięte (także po pustych liniach) należy do tego punktu
        const childLines: string[] = [];
        while (i < lines.length) {
          const next = lines[i];
          if (next.trim() === '') {
            const following = lines.slice(i + 1).find((l) => l.trim() !== '');
            if (following !== undefined && indentOf(following) > base) {
              childLines.push('');
              i++;
              continue;
            }
            break;
          }
          if (indentOf(next) <= base) break;
          childLines.push(next);
          i++;
        }
        const minIndent = Math.min(...childLines.filter((l) => l.trim()).map(indentOf));
        items.push({ text: m[3], children: parse(childLines.map((l) => l.slice(Number.isFinite(minIndent) ? minIndent : 0))) });
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }
    const text: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3}\s|>|\||---$)/.test(lines[i].trim()) &&
      !LIST_ITEM.test(lines[i])
    ) {
      text.push(lines[i++].trim());
    }
    blocks.push({ type: 'paragraph', text: text.join(' ') });
  }
  return blocks;
}

const INLINE = /(\*\*[^*]+\*\*|\[\[[^\]]+\]\]|https?:\/\/[^\s)<]+[^\s)<.,;:])/g;

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-cream">{inline(part.slice(2, -2))}</strong>;
    }
    if (part.startsWith('[[') && part.endsWith(']]')) {
      return (
        <mark key={i} className="rounded-sm bg-gold/25 px-1 text-gold-light" title="Do uzupełnienia">
          {part.slice(2, -2)}
        </mark>
      );
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noreferrer" className="text-gold underline-offset-2 hover:underline">
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function render(blocks: Block[], key = ''): ReactNode[] {
  return blocks.map((b, i) => {
    const k = `${key}${i}`;
    switch (b.type) {
      case 'heading':
        if (b.level === 1) return <h1 key={k} className="heading text-4xl sm:text-5xl">{inline(b.text)}</h1>;
        if (b.level === 2)
          return <h2 key={k} className="heading mt-12 border-t border-line pt-8 text-2xl text-cream">{inline(b.text)}</h2>;
        return <h3 key={k} className="mt-8 font-display text-lg uppercase tracking-wide text-gold">{inline(b.text)}</h3>;
      case 'paragraph':
        return <p key={k} className="mt-4 leading-relaxed text-cream/85">{inline(b.text)}</p>;
      case 'quote':
        return (
          <blockquote key={k} className="mt-6 border-l-2 border-gold bg-coal px-5 py-4 text-sm leading-relaxed text-stone">
            {inline(b.text)}
          </blockquote>
        );
      case 'hr':
        return <hr key={k} className="mt-10 border-line" />;
      case 'table':
        return (
          <div key={k} className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-sm">
              <thead>
                <tr>
                  {b.rows[0].map((c, j) => (
                    <th key={j} className="border-b-2 border-gold/50 px-3 py-2 text-left font-display uppercase tracking-wider text-gold">
                      {inline(c)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.slice(1).map((row, r) => (
                  <tr key={r} className="align-top">
                    {row.map((c, j) => (
                      <td key={j} className="border-b border-line px-3 py-3 leading-relaxed text-cream/85">
                        {inline(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'list': {
        const Tag = b.ordered ? 'ol' : 'ul';
        return (
          <Tag
            key={k}
            className={`mt-3 space-y-2 pl-6 leading-relaxed text-cream/85 ${b.ordered ? 'list-decimal' : 'list-disc'} marker:text-gold`}
          >
            {b.items.map((item, j) => (
              <li key={j} className="pl-1">
                {inline(item.text)}
                {render(item.children, `${k}-${j}-`)}
              </li>
            ))}
          </Tag>
        );
      }
    }
  });
}

export function Markdown({ source }: { source: string }) {
  return <>{render(parse(source.replace(/\r\n/g, '\n').split('\n')))}</>;
}
