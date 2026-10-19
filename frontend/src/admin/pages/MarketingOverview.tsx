import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, CircularProgress, Link, Stack, Typography } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EventIcon from '@mui/icons-material/Event';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import LabelIcon from '@mui/icons-material/Label';
import InsightsIcon from '@mui/icons-material/Insights';
import { apiUrl, httpClient } from '../../dataProvider';
import { LabelChip } from '../components/labels';

interface Overview {
  today: string;
  activePromotions: Promo[];
  scheduledPromotions: Promo[];
  scheduledArticles: { id: string; title: string; publishAt: string; onSite: boolean; newsletter: boolean }[];
  subscribers: number;
  scheduledProducts: {
    id: string;
    name: string;
    date: string;
    change: 'available' | 'unavailable';
    seasonal: boolean;
  }[];
  labels: {
    id: string;
    name: string;
    color: string;
    from: string | null;
    to: string | null;
    products: number;
    change: 'starts' | 'ends';
  }[];
  lastNewsletter: { id: string; title: string; sentAt: string; recipients: number; visits: number } | null;
  topProducts: { id: string; name: string; count: number }[];
}
type Promo = { id: string; name: string; price: number; promoPrice: number | null; from: string | null; to: string | null };

const money = (n: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(n);
const day = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'long' });
const when = (iso: string) =>
  new Date(iso).toLocaleString('pl-PL', { weekday: 'short', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

/** Karta pulpitu z nagłówkiem, ikoną i linkiem „Przejdź” */
const Panel = ({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: ReactNode;
  action?: { label: string; onClick: () => void };
  children: ReactNode;
}) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
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
      </Stack>
      {children}
    </CardContent>
  </Card>
);

const Empty = ({ children }: { children: ReactNode }) => (
  <Typography variant="body2" color="text.secondary">
    {children}
  </Typography>
);

/** Wiersz listy: klikalna nazwa + opis po prawej/pod spodem */
const Row = ({ name, detail, onClick }: { name: ReactNode; detail: ReactNode; onClick?: () => void }) => (
  <Box sx={{ py: 0.75, borderTop: 1, borderColor: 'divider', '&:first-of-type': { borderTop: 0 } }}>
    {onClick ? (
      <Link component="button" type="button" underline="hover" onClick={onClick} sx={{ textAlign: 'left', fontSize: '0.95rem' }}>
        {name}
      </Link>
    ) : (
      <Typography variant="body2">{name}</Typography>
    )}
    <Typography variant="body2" color="text.secondary">
      {detail}
    </Typography>
  </Box>
);

const promoDetail = (p: Promo, scheduled: boolean) =>
  [
    p.promoPrice != null ? `${money(p.promoPrice)} zamiast ${money(p.price)}` : 'tylko etykieta',
    scheduled && p.from ? `od ${day(p.from)}` : null,
    p.to ? `do ${day(p.to)}` : 'bez daty końca',
  ]
    .filter(Boolean)
    .join(' · ');

const productChange = (p: Overview['scheduledProducts'][number]) =>
  p.change === 'available'
    ? p.seasonal
      ? 'wraca do sprzedaży'
      : 'pojawi się w ofercie'
    : p.seasonal
      ? 'przejdzie do „Wrócą w sezonie”'
      : 'zniknie z oferty';

/**
 * Pulpit „Marketing”: co teraz trwa i co jest zaplanowane – promocje, wpisy i newslettery, zmiany w ofercie,
 * etykiety z datami (14 dni) – oraz skrót wyników. Dane z GET /stats/marketing.
 */
export const MarketingOverview = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Overview | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    httpClient(`${apiUrl}/stats/marketing`)
      .then(({ json }) => !cancelled && setData(json as Overview))
      .catch(() => !cancelled && setData(null));
    return () => {
      cancelled = true;
    };
  }, []);

  if (data === undefined) return <CircularProgress size={28} sx={{ mt: 2 }} />;
  if (data === null)
    return <Empty>Nie udało się wczytać podsumowania marketingu – odśwież stronę.</Empty>;

  const promos = [...data.activePromotions.map((p) => ({ p, scheduled: false })), ...data.scheduledPromotions.map((p) => ({ p, scheduled: true }))];

  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      <Panel title="Promocje" icon={<LocalOfferIcon />} action={{ label: 'Produkty', onClick: () => navigate('/products') }}>
        {promos.length === 0 ? (
          <Empty>Nie trwa ani nie jest zaplanowana żadna promocja.</Empty>
        ) : (
          promos.map(({ p, scheduled }) => (
            <Row
              key={p.id + scheduled}
              name={
                <>
                  {p.name}{' '}
                  <Typography component="span" variant="caption" sx={{ color: scheduled ? 'info.main' : 'success.main' }}>
                    {scheduled ? 'zaplanowana' : 'trwa'}
                  </Typography>
                </>
              }
              detail={promoDetail(p, scheduled)}
              onClick={() => navigate(`/products/${p.id}`)}
            />
          ))
        )}
      </Panel>

      <Panel
        title="Zaplanowane wpisy i newslettery"
        icon={<EventIcon />}
        action={{ label: 'Nowy wpis', onClick: () => navigate('/blog/create') }}
      >
        {data.scheduledArticles.length === 0 ? (
          <Empty>Brak zaplanowanych wpisów. Wpis możesz zaplanować polem „Zaplanuj publikację”.</Empty>
        ) : (
          data.scheduledArticles.map((a) => (
            <Row
              key={a.id}
              name={a.title}
              detail={`${when(a.publishAt)} · ${[
                a.onSite && 'na stronie',
                a.newsletter && `newsletter do ${data.subscribers} os.`,
              ]
                .filter(Boolean)
                .join(' i ')}`}
              onClick={() => navigate(`/blog/${a.id}`)}
            />
          ))
        )}
      </Panel>

      <Panel title="Zmiany w ofercie" icon={<BakeryDiningIcon />}>
        {data.scheduledProducts.length === 0 ? (
          <Empty>Brak zaplanowanych zmian. Ustawisz je w produkcie: „Dostępny od” / „Niedostępny od”.</Empty>
        ) : (
          data.scheduledProducts.map((p) => (
            <Row
              key={p.id + p.change}
              name={p.name}
              detail={`od ${day(p.date)} – ${productChange(p)}`}
              onClick={() => navigate(`/products/${p.id}`)}
            />
          ))
        )}
      </Panel>

      <Panel title="Etykiety z datami (14 dni)" icon={<LabelIcon />} action={{ label: 'Etykiety', onClick: () => navigate('/products/labels') }}>
        {data.labels.length === 0 ? (
          <Empty>W ciągu 14 dni żadna etykieta z datami się nie zaczyna ani nie kończy.</Empty>
        ) : (
          data.labels.map((l) => (
            <Row
              key={l.id}
              name={<LabelChip name={l.name} color={l.color} />}
              detail={`${l.change === 'starts' ? `pojawi się od ${day(l.from!)}` : `widoczna do ${day(l.to!)}`} · ${l.products} prod.`}
              onClick={() => navigate(`/products/labels/${l.id}`)}
            />
          ))
        )}
      </Panel>

      <Box sx={{ gridColumn: { md: '1 / -1' } }}>
        <Panel title="Wyniki" icon={<InsightsIcon />} action={{ label: 'Statystyki', onClick: () => navigate('/statystyki') }}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Ostatni newsletter
              </Typography>
              {data.lastNewsletter ? (
                <>
                  <Typography variant="body1">{data.lastNewsletter.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(data.lastNewsletter.sentAt).toLocaleDateString('pl-PL')} · do {data.lastNewsletter.recipients}{' '}
                    os. · <strong>{data.lastNewsletter.visits}</strong> wejść na stronę z linków w e-mailu
                  </Typography>
                </>
              ) : (
                <Empty>Jeszcze nie wysłano newslettera z licznikiem wejść.</Empty>
              )}
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Najczęściej oglądane produkty – 7 dni
              </Typography>
              {data.topProducts.length === 0 ? (
                <Empty>Brak wyświetleń produktów w tym tygodniu.</Empty>
              ) : (
                data.topProducts.map((p, i) => (
                  <Typography key={p.id} variant="body2">
                    {i + 1}. {p.name} – <strong>{p.count}</strong>
                  </Typography>
                ))
              )}
            </Box>
          </Box>
        </Panel>
      </Box>
    </Box>
  );
};
