import { useEffect, useState, type ReactNode } from 'react';
import { Title, useGetIdentity, usePermissions } from 'react-admin';
import { useSubscriberCount } from '../common/useSubscriberCount';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardActionArea, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
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

const StatCard = ({
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
  <Card variant="outlined" sx={{ flex: 1, minWidth: 220, borderTop: (t) => `2px solid ${t.palette.primary.main}` }}>
    <CardActionArea onClick={onClick} sx={{ height: '100%', display: 'flex', alignItems: 'flex-start' }}>
      <CardContent sx={{ p: 3, width: '100%' }}>
        <Typography variant="overline" color="primary">
          {label}
        </Typography>
        <Typography variant="h3" sx={{ my: 1, fontWeight: 400 }}>
          {value === undefined ? <CircularProgress size={28} /> : value === null ? '—' : value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {hint}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

const Action = ({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) => (
  <Button variant="outlined" startIcon={icon} onClick={onClick} sx={{ justifyContent: 'flex-start' }}>
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

      {/* administrator: najpierw rezerwacje (dziś, jutro) i newsletter; konto marketingowe – od razu marketing */}
      {isOwner && (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 4 }}>
          <>
            <StatCard
              label="Rezerwacje na dziś"
              value={todayCount}
              hint="Zobacz listę rezerwacji na dziś"
              onClick={() =>
                navigate(`/reservations?filter=${encodeURIComponent(JSON.stringify({ pickupDate: today }))}`)
              }
            />
            <StatCard
              label="Rezerwacje na jutro"
              value={tomorrowCount}
              hint="Do przygotowania – zestawienie, wydruk, e-mail"
              onClick={() => navigate('/przygotowanie')}
            />
          </>
          <StatCard
            label="Newsletter"
            value={confirmed}
            hint="Potwierdzeni subskrybenci"
            onClick={() => navigate('/newsletter')}
          />
        </Stack>
      )}

      <Typography variant="h6" sx={{ mt: isOwner ? 5 : 4, mb: 2 }}>
        Marketing – co trwa i co jest zaplanowane
      </Typography>
      <MarketingOverview />

      <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
        Szybkie akcje
      </Typography>
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' } }}>
        <Action icon={<AddIcon />} label="Dodaj produkt" onClick={() => navigate('/products/create')} />
        <Action icon={<ArticleIcon />} label="Nowy wpis / newsletter" onClick={() => navigate('/blog/create')} />
        <Action icon={<CampaignIcon />} label="Baner informacyjny" onClick={() => navigate('/announcements')} />
        <Action icon={<EditCalendarIcon />} label="Trasa chlebowozu" onClick={() => navigate('/bread-van/locations')} />
        <Action
          icon={<InsightsIcon />}
          label={isOwner ? 'Statystyki i koszty' : 'Statystyki odwiedzin'}
          onClick={() => navigate('/statystyki')}
        />
        <Button
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          href={webUrl}
          target="_blank"
          rel="noreferrer"
          sx={{ justifyContent: 'flex-start' }}
        >
          Otwórz stronę piekarni
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 5 }}>
        Zmiany zapisane w panelu pojawiają się na stronie po kilku sekundach. Odpowiedzi na najczęstsze pytania
        znajdziesz w zakładce „Pomoc”.
      </Typography>
    </Box>
  );
};

export default HomePage;
