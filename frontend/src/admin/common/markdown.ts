/**
 * Parser Markdown dokumentów prawnych – ten sam co na stronie (web/src/lib/markdown.tsx), do podglądu w panelu:
 * nagłówki #–###, akapity, cytaty >, listy - i 1. (zagnieżdżone wcięciem), tabele |…|, --- ,
 * **pogrubienie**, adresy URL oraz pola do uzupełnienia [[…]].
 */

export type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'hr' }
  | { type: 'table'; rows: string[][] }
  | { type: 'list'; ordered: boolean; items: { text: string; children: Block[] }[] };

const LIST_ITEM = /^(\s*)([-*]|\d+\.)\s+(.*)$/;
const indentOf = (line: string) => line.match(/^\s*/)![0].length;

export function parse(lines: string[]): Block[] {
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

export const INLINE = /(\*\*[^*]+\*\*|\[\[[^\]]+\]\]|https?:\/\/[^\s)<]+[^\s)<.,;:])/g;

/** Pola do uzupełnienia [[…]] w dokumencie */
export const placeholders = (source: string) => [...new Set(source.match(/\[\[[^\]]+\]\]/g) ?? [])];
