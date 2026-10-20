import { useEffect, useState, type ReactNode } from 'react';
import { Title, useGetIdentity, usePermissions } from 'react-admin';
import { useSubscriberCount } from '../common/useSubscriberCount';
import { DashboardPanel } from '../common/PanelVisibility';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CardActionArea, CircularProgress, Paper, Typography } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BoltIcon from '@mui/icons-material/Bolt';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import CampaignIcon from '@mui/icons-material/Campaign';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InsightsIcon from '@mui/icons-material/Insights';
import { MarketingOverview } from './MarketingOverview';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:3001';

/** Data w czasie polskim (YYYY-MM-DD), przesunięta o `days` */
const warsawDate = (days = 0) => {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw' }).format(new Date());
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

/** Liczba rezerwacji (bez anulowanych) na dany dzień – z tego samego zestawienia co „Do przygotowania” */
function useReservationCount(date: string, enabled: boolean) {
  const [count, setCount] = useState<number | null | undefined>(undefined);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetch(`${apiUrl}/reservations/summary?date=${date}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((s: { reservationsCount: number }) => !cancelled && setCount(s.reservationsCount))
      .catch(() => !cancelled && setCount(null));
    return () => {
      cancelled = true;
    };
  }, [date, enabled]);
  return count;
}

/** Licznik w panelu „Rezerwacje i newsletter” – kliknięcie prowadzi do szczegółów */
const StatTile = ({
  label,
  value,
  hint,
  onClick,
}: {
  label: string;
  value: number | null | undefined;
  hint: string;
  onClick: () => void;
}) => (
  <Paper variant="outlined" sx={{ borderTop: (t) => `2px solid ${t.palette.primary.main}` }}>
    <CardActionArea onClick={onClick} sx={{ p: 1.5, height: '100%' }}>
      <Typography variant="overline" color="primary" sx={{ lineHeight: 1.6 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ my: 0.5, fontWeight: 400 }}>
        {value === undefined ? <CircularProgress size={22} /> : value === null ? '—' : value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {hint}
      </Typography>
    </CardActionArea>
  </Paper>
);

const Action = ({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) => (
  <Button variant="outlined" size="small" startIcon={icon} onClick={onClick} sx={{ justifyContent: 'flex-start' }}>
    {label}
  </Button>
);

const greeting = () => {
  const hour = Number(
    new Intl.DateTimeFormat('pl-PL', { hour: 'numeric', timeZone: 'Europe/Warsaw' }).format(new Date()),
  );
  return hour >= 18 || hour < 4 ? 'Dobry wieczór' : 'Dzień dobry';
};

const HomePage = () => {
  const navigate = useNavigate();
  const today = warsawDate(0);
  // rezerwacje (dane klientów) widzi tylko administrator
  const { permissions } = usePermissions();
  const isOwner = permissions === 'ADMIN';
  const { identity } = useGetIdentity();
  const todayCount = useReservationCount(today, isOwner);
  const tomorrowCount = useReservationCount(warsawDate(1), isOwner);
  const confirmed = useSubscriberCount();
  const todayLabel = new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Warsaw',
  }).format(new Date());

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', py: { xs: 2, md: 4 } }}>
      <Title title="Pulpit" />
      <Typography variant="overline" color="primary">
        Panel Chleba Smak
      </Typography>
      <Typography variant="h4" sx={{ mt: 0.5 }}>
        {greeting()}
        {identity?.fullName ? `, ${identity.fullName}` : ''}!
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, '&::first-letter': { textTransform: 'uppercase' } }}>
        {todayLabel}
      </Typography>

      {/* panele w dwóch kolumnach: na górze liczniki (rezerwacje widzi tylko administrator) i szybkie akcje,
          pod nimi marketing – co trwa i co jest zaplanowane */}
      <Box sx={{ mt: 4 }}>
        <MarketingOverview
          left={[
            <DashboardPanel key="counts" title={isOwner ? 'Rezerwacje i newsletter' : 'Newsletter'} icon={<ReceiptLongIcon />}>
              <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: isOwner ? 'repeat(3, 1fr)' : '1fr' } }}>
                {isOwner && (
                  <StatTile
                    label="Na dziś"
                    value={todayCount}
                    hint="Lista rezerwacji"
                    onClick={() =>
                      navigate(`/reservations?filter=${encodeURIComponent(JSON.stringify({ pickupDate: today }))}`)
                    }
                  />
                )}
                {isOwner && (
                  <StatTile
                    label="Na jutro"
                    value={tomorrowCount}
                    hint="Do przygotowania"
                    onClick={() => navigate('/przygotowanie')}
                  />
                )}
                <StatTile
                  label="Subskrybenci"
                  value={confirmed}
                  hint="Potwierdzeni"
                  onClick={() => navigate('/newsletter')}
                />
              </Box>
            </DashboardPanel>,
          ]}
          right={[
            <DashboardPanel key="actions" title="Szybkie akcje" icon={<BoltIcon />}>
              <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                <Action icon={<AddIcon />} label="Dodaj produkt" onClick={() => navigate('/products/create')} />
                <Action icon={<ArticleIcon />} label="Nowy wpis" onClick={() => navigate('/blog/create')} />
                <Action icon={<CampaignIcon />} label="Baner" onClick={() => navigate('/announcements')} />
                <Action icon={<EditCalendarIcon />} label="Trasa chlebowozu" onClick={() => navigate('/bread-van/locations')} />
                <Action
                  icon={<InsightsIcon />}
                  label={isOwner ? 'Statystyki i koszty' : 'Statystyki'}
                  onClick={() => navigate('/statystyki')}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<OpenInNewIcon />}
                  href={webUrl}
                  target="_blank"
                  rel="noreferrer"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Strona piekarni
                </Button>
              </Box>
            </DashboardPanel>,
          ]}
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 5 }}>
        Zmiany zapisane w panelu pojawiają się na stronie po kilku sekundach. Odpowiedzi na najczęstsze pytania
        znajdziesz w zakładce „Pomoc”.
      </Typography>
    </Box>
  );
};

export default HomePage;
