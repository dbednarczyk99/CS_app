import { Fragment, type ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { INLINE, parse, type Block } from './markdown';

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{inline(part.slice(2, -2))}</strong>;
    if (part.startsWith('[[') && part.endsWith(']]'))
      return (
        <Box
          component="mark"
          key={i}
          title="Do uzupełnienia"
          sx={{ bgcolor: 'warning.main', color: 'warning.contrastText', px: 0.5, borderRadius: 0.5 }}
        >
          {part.slice(2, -2)}
        </Box>
      );
    if (/^https?:\/\//.test(part))
      return (
        <a key={i} href={part} target="_blank" rel="noreferrer">
          {part}
        </a>
      );
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function render(blocks: Block[], key = ''): ReactNode[] {
  return blocks.map((b, i) => {
    const k = `${key}${i}`;
    switch (b.type) {
      case 'heading':
        return (
          <Typography
            key={k}
            variant={b.level === 1 ? 'h4' : b.level === 2 ? 'h6' : 'subtitle1'}
            sx={{ mt: b.level === 1 ? 0 : 3, mb: 1, fontWeight: 600, color: b.level === 3 ? 'primary.main' : undefined }}
          >
            {inline(b.text)}
          </Typography>
        );
      case 'paragraph':
        return (
          <Typography key={k} variant="body2" sx={{ mt: 1.5, lineHeight: 1.7 }}>
            {inline(b.text)}
          </Typography>
        );
      case 'quote':
        return (
          <Box key={k} sx={{ mt: 2, borderLeft: 3, borderColor: 'primary.main', pl: 2, py: 1, color: 'text.secondary' }}>
            <Typography variant="body2">{inline(b.text)}</Typography>
          </Box>
        );
      case 'hr':
        return <Box key={k} component="hr" sx={{ my: 3, border: 0, borderTop: 1, borderColor: 'divider' }} />;
      case 'table':
        return (
          <Box key={k} sx={{ mt: 2, overflowX: 'auto' }}>
            <Box component="table" sx={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
              <thead>
                <tr>
                  {b.rows[0].map((c, j) => (
                    <Box component="th" key={j} sx={{ textAlign: 'left', p: 1, borderBottom: 2, borderColor: 'primary.main' }}>
                      {inline(c)}
                    </Box>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.slice(1).map((row, r) => (
                  <tr key={r}>
                    {row.map((c, j) => (
                      <Box component="td" key={j} sx={{ p: 1, borderBottom: 1, borderColor: 'divider', verticalAlign: 'top' }}>
                        {inline(c)}
                      </Box>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        );
      case 'list':
        return (
          <Box key={k} component={b.ordered ? 'ol' : 'ul'} sx={{ mt: 1, pl: 3, fontSize: 14, lineHeight: 1.7 }}>
            {b.items.map((item, j) => (
              <li key={j}>
                {inline(item.text)}
                {render(item.children, `${k}-${j}-`)}
              </li>
            ))}
          </Box>
        );
    }
  });
}

/** Podgląd dokumentu prawnego w panelu – ta sama składnia co na stronie (pola [[…]] wyróżnione) */
export function MarkdownPreview({ source }: { source: string }) {
  return <>{render(parse(source.replace(/\r\n/g, '\n').split('\n')))}</>;
}
