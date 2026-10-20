import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';
import type { ScreenTab } from './screen-tabs';

/**
 * Zakładki nad ekranem, który w menu jest jedną pozycją, a pod spodem ma kilka list (np. Kategorie | Etykiety).
 * Adresy ekranów się nie zmieniają – zakładka to po prostu link.
 */
export function ScreenTabs({ tabs }: { tabs: ScreenTab[] }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // najdłuższe dopasowanie – np. /products/labels nie myli się z /products
  const active = [...tabs]
    .sort((a, b) => (b.match ?? b.to).length - (a.match ?? a.to).length)
    .find((t) => pathname.startsWith(t.match ?? t.to));
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
      <Tabs value={active?.to ?? false} onChange={(_, to: string) => navigate(to)} variant="scrollable" allowScrollButtonsMobile>
        {tabs.map((t) => (
          <Tab key={t.to} label={t.label} value={t.to} />
        ))}
      </Tabs>
    </Box>
  );
}
