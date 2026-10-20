import type { ReactNode } from 'react';
import { Box, Button, Card, CardContent, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
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
 * Karta pulpitu: ikona, nagłówek, opcjonalny link (np. „Produkty”) i oko – ukryta zwija się do paska
 * (zapamiętane, id = „pulpit:<nagłówek>”).
 */
export function DashboardPanel({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: ReactNode;
  action?: { label: string; onClick: () => void };
  children: ReactNode;
}) {
  const [hidden, toggle] = usePanelHidden(`pulpit:${title}`);
  if (hidden) return <HiddenPanelBar title={title} icon={icon} onShow={toggle} />;
  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
          <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
          <Typography variant="h6" sx={{ flex: 1, fontSize: '1.05rem' }}>
            {title}
          </Typography>
          {action && (
            <Button size="small" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          <HidePanelButton onClick={toggle} />
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}
