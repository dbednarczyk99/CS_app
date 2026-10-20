import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Link, Typography } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EventIcon from '@mui/icons-material/Event';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import LabelIcon from '@mui/icons-material/Label';
import InsightsIcon from '@mui/icons-material/Insights';
import { apiUrl, httpClient } from '../../dataProvider';
import { DashboardPanel } from '../common/PanelVisibility';
import { PanelColumns } from '../common/PanelColumns';
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

/** Karta pulpitu (wspólna z „Rezerwacje i newsletter” i „Szybkie akcje”) */
const Panel = DashboardPanel;

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
export const MarketingOverview = ({
  left = [],
  right = [],
}: {
  /** panele pulpitu nad panelami marketingu – lewa i prawa kolumna (np. rezerwacje, szybkie akcje) */
  left?: ReactNode[];
  right?: ReactNode[];
}) => {
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

  // wczytywanie / błąd – panele z zewnątrz od razu, marketing w miejscu pod nimi
  if (!data)
    return (
      <PanelColumns
        left={[
          ...left,
          data === undefined ? (
            <CircularProgress key="loading" size={28} />
          ) : (
            <Empty key="error">Nie udało się wczytać podsumowania marketingu – odśwież stronę.</Empty>
          ),
        ]}
        right={right}
      />
    );

  const promos = [...data.activePromotions.map((p) => ({ p, scheduled: false })), ...data.scheduledPromotions.map((p) => ({ p, scheduled: true }))];

  const promoPanel = (
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
  );

  const articlesPanel = (
      <Panel
        title="Zaplanowane wpisy i newslettery"
        icon={<EventIcon />}
        action={{ label: 'Szczegóły', onClick: () => navigate('/marketing/zaplanowane') }}
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
  );

  const offerPanel = (
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
  );

  const labelsPanel = (
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
  );

  const resultsPanel = (
        <Panel title="Wyniki" icon={<InsightsIcon />} action={{ label: 'Statystyki', onClick: () => navigate('/statystyki') }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
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
  );

  // dwie kolumny o równej szerokości; zwinięty panel – kolejny w tej samej kolumnie podjeżdża w górę
  return (
    <PanelColumns
      left={[...left, promoPanel, offerPanel, resultsPanel]}
      right={[...right, articlesPanel, labelsPanel]}
    />
  );
};
