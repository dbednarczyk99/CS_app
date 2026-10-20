import type { ReactNode } from 'react';
import { Box, Stack, useMediaQuery, type Theme } from '@mui/material';

/**
 * Dwie kolumny paneli o równej szerokości (pulpit, statystyki). Kolumny są niezależne: zwinięty panel robi się
 * niski, a panel pod nim w tej samej kolumnie podjeżdża w górę. Na telefonie jedna kolumna – panele na przemian
 * z lewej i prawej (zachowana kolejność ważności). Puste pozycje (false/null) są pomijane.
 */
export function PanelColumns({ left, right, sx }: { left: ReactNode[]; right: ReactNode[]; sx?: object }) {
  const wide = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const l = left.filter(Boolean);
  const r = right.filter(Boolean);

  if (!wide) {
    const all: ReactNode[] = [];
    for (let i = 0; i < Math.max(l.length, r.length); i++) all.push(l[i], r[i]);
    return (
      <Stack spacing={2} sx={sx}>
        {all.filter(Boolean).map((panel, i) => (
          <Box key={i}>{panel}</Box>
        ))}
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={2} alignItems="flex-start" sx={sx}>
      {[l, r].map((column, c) => (
        <Stack key={c} spacing={2} sx={{ flex: 1, minWidth: 0 }}>
          {column.map((panel, i) => (
            <Box key={i}>{panel}</Box>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
