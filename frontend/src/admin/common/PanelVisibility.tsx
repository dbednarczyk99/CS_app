import type { ReactNode } from 'react';
import { Box, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { usePanelHidden } from './panel-visibility';

/** Przycisk z okiem w nagłówku panelu – chowa panel do paska */
export function HidePanelButton({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip title="Ukryj panel (zostanie sam nagłówek)">
      <IconButton size="small" onClick={onClick} aria-label="Ukryj panel" sx={{ color: 'text.secondary' }}>
        <VisibilityOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

/** Ukryty panel: pasek z nagłówkiem i przekreślonym okiem – kliknięcie rozwija panel */
export function HiddenPanelBar({ title, icon, onShow }: { title: string; icon?: ReactNode; onShow: () => void }) {
  return (
    <Paper
      variant="outlined"
      onClick={onShow}
      role="button"
      tabIndex={0}
      aria-label={`Pokaż panel „${title}”`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onShow())}
      sx={{
        px: 2,
        py: 1,
        cursor: 'pointer',
        alignSelf: 'start',
        opacity: 0.75,
        transition: 'opacity .15s',
        '&:hover, &:focus-visible': { opacity: 1 },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center">
        {icon && <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>}
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
          {title}
        </Typography>
        <Tooltip title="Pokaż panel">
          <VisibilityOffOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        </Tooltip>
      </Stack>
    </Paper>
  );
}

/**
 * Sekcja pulpitu z nagłówkiem (bez karty) – np. „Szybkie akcje”: oko obok nagłówka, ukryta = pasek.
 */
export function HideableSection({
  id,
  title,
  children,
  sx,
}: {
  id: string;
  title: string;
  children: ReactNode;
  sx?: object;
}) {
  const [hidden, toggle] = usePanelHidden(id);
  if (hidden)
    return (
      <Box sx={sx}>
        <HiddenPanelBar title={title} onShow={toggle} />
      </Box>
    );
  return (
    <Box sx={sx}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <HidePanelButton onClick={toggle} />
      </Stack>
      {children}
    </Box>
  );
}
