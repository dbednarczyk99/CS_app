import { useEffect, useState, type ReactNode } from 'react';
import { Title, useGetList, usePermissions } from 'react-admin';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import MapIcon from '@mui/icons-material/Map';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { HiddenPanelBar, HidePanelButton } from '../common/PanelVisibility';
import { usePanelHidden } from '../common/panel-visibility';
import { PanelColumns } from '../common/PanelColumns';
import { scheduledArticles, type ScheduledArticle } from '../common/scheduled';
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Stats {
  today: string;
  limits: {
    emailDaily: number;
    emailMonthly: number;
    mapsMonthlyFree: number;
    mapsPricePer1000Usd: number;
    usdPln: number;
  };
  month: {
    start: string;
    dayOfMonth: number;
    daysInMonth: number;
    views: number;
    maps: number;
    mails: number;
    mailsFailed: number;
    forecast: { views: number; maps: number; mails: number };
    mapsCostPln: number;
  };
  todayTotals: { views: number; maps: number; mails: number; mailsFailed: number };
  series: { date: string; views: number; maps: number; mails: number }[];
  pages: { key: string; count: number }[];
  sources: { key: string; count: number }[];
  // wyświetlenia stron produktów (top 10); active: false – produkt ukryty na stronie
  products?: { id: string; name: string; active: boolean; count: number }[];
  // skuteczność newsletterów: wejścia na stronę z linków w e-mailach (od wysyłki)
  newsletters?: {
    id: string;
    title: string;
    sentAt: string;
    recipients: number;
    visits: number;
    articleVisits: number;
    products: { name: string; count: number }[];
  }[];
  // skuteczność promocji: rezerwacje (szt., wg dnia odbioru) i wyświetlenia w czasie promocji i tuż przed nią
  promotions?: {
    id: string;
    name: string;
    price: number;
    promoPrice: number | null;
    from: string;
    to: string | null;
    status: 'active' | 'ended';
    days: number;
    during: { quantity: number; views: number };
    before: { quantity: number; views: number };
  }[];
  mapsBySource: { key: string; count: number }[];
  mailsByCategory: { key: string; count: number }[];
  reservations: {
    count: number;
    cancelled: number;
    total: number;
    store: number;
    van: number;
    topProducts: { name: string; quantity: number }[];
  };
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Strona główna',
  '/oferta': 'Oferta',
  '/oferta/[produkt]': 'Strony produktów',
  '/piekarnie': 'Piekarnie',
  '/chlebowoz': 'Chlebowóz',
  '/o-nas': 'O nas',
  '/aktualnosci': 'Aktualności',
  '/aktualnosci/[wpis]': 'Wpisy w aktualnościach',
  '/kontakt': 'Kontakt',
  '/rezerwacja': 'Rezerwacja',
  '/rezerwacja/anuluj': 'Anulowanie rezerwacji',
  '/newsletter': 'Newsletter (potwierdzenia, wypisy)',
  '/regulamin': 'Regulamin',
  '/polityka-prywatnosci': 'Polityka prywatności',
  '(inne)': 'Inne adresy (np. błędne linki)',
};
const MAIL_LABELS: Record<string, string> = {
  rezerwacja: 'Potwierdzenia rezerwacji',
  anulowanie: 'Potwierdzenia anulowania',
  zestawienie: 'Zestawienia „Do przygotowania”',
  kontakt: 'Wiadomości z formularza kontaktowego',
  newsletter: 'Newsletter',
  'newsletter-zapis': 'Potwierdzenia zapisu do newslettera',
  inne: 'Inne',
};
const SOURCE_LABELS: Record<string, string> = {
  google: 'Google (wyszukiwarka i Mapy)',
  bezposrednio: 'Bezpośrednio (wpisany adres, zakładka, aplikacje)',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  newsletter: 'Newsletter',
  'inne-wyszukiwarki': 'Inne wyszukiwarki',
  'inne-strony': 'Inne strony',
};
const MAP_LABELS: Record<string, string> = {
  piekarnie: 'Strona „Piekarnie”',
  chlebowoz: 'Strona „Chlebowóz”',
  rezerwacja: 'Formularz rezerwacji',
};

const fmt = (n: number) => new Intl.NumberFormat('pl-PL').format(n);
const money = (n: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(n);
const shortDate = (d: string) => `${Number(d.slice(8, 10))}.${d.slice(5, 7)}`;
const monthName = (d: string) =>
  new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${d}T12:00:00Z`),
  );

/** Kolor paska: do 70% złoty, 70–90% ostrzeżenie, od 90% czerwony */
const levelColor = (pct: number): 'primary' | 'warning' | 'error' =>
  pct >= 90 ? 'error' : pct >= 70 ? 'warning' : 'primary';

/** Pasek postępu wobec limitu; jaśniejsza część = prognoza na koniec miesiąca */
function LimitBar({
  label,
  value,
  limit,
  forecast,
  hint,
}: {
  label: string;
  value: number;
  limit: number;
  forecast?: number;
  hint?: ReactNode;
}) {
  const pct = Math.min(100, (value / limit) * 100);
  const forecastPct = forecast !== undefined ? Math.min(100, (forecast / limit) * 100) : undefined;
  const color = levelColor(Math.max(pct, forecastPct ?? 0));
  return (
    <Box sx={{ mt: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2">
          <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {fmt(value)}
          </Box>{' '}
          <Box component="span" sx={{ color: 'text.secondary' }}>
            / {fmt(limit)}
          </Box>
        </Typography>
      </Stack>
      {/* ścieżka = limit; jaśniejszy odcinek = prognoza; pełny = stan obecny */}
      <Box
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={value}
        sx={{
          position: 'relative',
          mt: 0.75,
          height: 10,
          borderRadius: 1,
          bgcolor: 'action.hover',
          overflow: 'hidden',
        }}
      >
        {forecastPct !== undefined && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              width: `${forecastPct}%`,
              bgcolor: `${color}.main`,
              opacity: 0.3,
              transition: 'width .4s',
            }}
          />
        )}
        <Box
          sx={{ position: 'absolute', inset: 0, width: `${pct}%`, bgcolor: `${color}.main`, transition: 'width .4s' }}
        />
      </Box>
      {hint && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
          {hint}
        </Typography>
      )}
    </Box>
  );
}

const Section = ({
  title,
  icon,
  children,
  sx,
  action,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  sx?: object;
  /** link w nagłówku, np. „Szczegóły” */
  action?: { label: string; onClick: () => void };
}) => {
  const [hidden, toggle] = usePanelHidden(`statystyki:${title}`);
  if (hidden)
    return (
      <Box sx={sx}>
        <HiddenPanelBar title={title} icon={icon} onShow={toggle} />
      </Box>
    );
  return (
    <Card variant="outlined" sx={{ height: '100%', ...sx }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
          <Typography variant="h6" sx={{ flex: 1 }}>
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
};

/** Lista z poziomymi paskami (udział w całości) */
function RankList({
  items,
  labels,
  empty,
}: {
  items: { key: string; count: number }[];
  labels: Record<string, string>;
  empty: string;
}) {
  if (items.length === 0)
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {empty}
      </Typography>
    );
  const max = Math.max(...items.map((i) => i.count));
  return (
    <Stack spacing={1.25} sx={{ mt: 2 }}>
      {items.map((i) => (
        <Box key={i.key}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">{labels[i.key] ?? i.key}</Typography>
            <Typography variant="body2" fontWeight={700}>
              {fmt(i.count)}
            </Typography>
          </Stack>
          <Box sx={{ mt: 0.5, height: 4, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Box
              sx={{ height: '100%', width: `${(i.count / max) * 100}%`, bgcolor: 'primary.main', borderRadius: 1 }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

type SeriesKey = 'views' | 'maps' | 'mails';
const SERIES_LABELS: Record<SeriesKey, string> = { views: 'Odsłony', maps: 'Wczytania mapy', mails: 'E-maile' };

/** Wykres słupkowy – dzień po dniu */
function DailyChart({ series, metric }: { series: Stats['series']; metric: SeriesKey }) {
  const max = Math.max(1, ...series.map((d) => d[metric]));
  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: series.length > 45 ? '1px' : '3px',
          height: 160,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {series.map((d) => (
          <Tooltip key={d.date} title={`${shortDate(d.date)}: ${fmt(d[metric])}`} placement="top" arrow>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                height: `${(d[metric] / max) * 100}%`,
                minHeight: d[metric] > 0 ? 3 : 0,
                bgcolor: 'primary.main',
                opacity: 0.85,
                borderRadius: '2px 2px 0 0',
                transition: 'opacity .15s',
                '&:hover': { opacity: 1 },
              }}
            />
          </Tooltip>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: '3px', mt: 0.75 }}>
        {series.map((d, i) => (
          <Typography
            key={d.date}
            variant="caption"
            color="text.secondary"
            sx={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 10 }}
          >
            {i % 5 === 0 || i === series.length - 1 ? shortDate(d.date) : ''}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

const Kpi = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ flex: 1, minWidth: 120 }}>
    <Typography variant="overline" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h4" sx={{ fontWeight: 400 }}>
      {value}
    </Typography>
  </Box>
);

/** Statystyki strony: limity i koszty (e-maile, Mapa Google), odwiedziny, rezerwacje – całość tylko administrator */
export default function StatsPage() {
  // administrator – całość; marketing – odwiedziny, źródła, najczęściej odwiedzane
  const { permissions } = usePermissions();
  const isOwner = permissions === 'ADMIN';
  const [days, setDays] = useState(30);
  const [visitsHidden, toggleVisits] = usePanelHidden('statystyki:Odwiedziny strony');
  const [result, setResult] = useState<{ days: number; stats?: Stats; error?: string } | null>(null);
  const [metric, setMetric] = useState<SeriesKey>('views');

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiUrl}/stats?days=${days}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
    })
      .then((res) =>
        res.ok ? (res.json() as Promise<Stats>) : Promise.reject(new Error('Nie udało się pobrać statystyk')),
      )
      .then((stats) => !cancelled && setResult({ days, stats }))
      .catch((e: Error) => !cancelled && setResult({ days, error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [days]);

  const stats = result?.days === days ? result.stats : undefined;
  const peak = (stats?.series ?? []).reduce((m, d) => (d.mails > m.mails ? d : m), { date: '', mails: 0 });
  const error = result?.days === days ? result.error : undefined;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: { xs: 2, md: 4 } }}>
      <Title title="Statystyki" />
      <Typography variant="overline" color="primary">
        Statystyki strony
      </Typography>
      <Typography variant="h4" sx={{ mt: 0.5, '&::first-letter': { textTransform: 'uppercase' } }}>
        {stats ? monthName(stats.today) : 'Statystyki'}
      </Typography>
      {stats && (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Dzień {stats.month.dayOfMonth} z {stats.month.daysInMonth}
          {isOwner && ' – limity planów liczą się w miesiącach kalendarzowych.'}
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
      {!stats && !error && <CircularProgress sx={{ mt: 4 }} />}

      {stats && (
        <>
          {/* dwie kolumny: po lewej ruch na stronie i rezerwacje, po prawej e-maile, newslettery, wpisy i promocje
              (zwinięty panel – kolejny w kolumnie podjeżdża w górę) */}
          <PanelColumns
            left={[
              visitsHidden ? (
            <Box>
              <HiddenPanelBar title="Odwiedziny strony" icon={<VisibilityIcon />} onShow={toggleVisits} />
            </Box>
          ) : (
          <Card variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box sx={{ color: 'primary.main', display: 'flex' }}>
                    <VisibilityIcon />
                  </Box>
                  <Typography variant="h6">Odwiedziny strony</Typography>
                  <HidePanelButton onClick={toggleVisits} />
                </Stack>
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={days}
                  onChange={(_, v) => v && setDays(v)}
                  aria-label="Okres"
                >
                  <ToggleButton value={7}>7 dni</ToggleButton>
                  <ToggleButton value={30}>30 dni</ToggleButton>
                  <ToggleButton value={90}>90 dni</ToggleButton>
                </ToggleButtonGroup>
              </Stack>

              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                <Kpi label="Odsłony dziś" value={fmt(stats.todayTotals.views)} />
                <Kpi label="W tym miesiącu" value={fmt(stats.month.views)} />
                <Kpi
                  label={`Średnio dziennie (${days} dni)`}
                  value={fmt(Math.round(stats.series.reduce((s, d) => s + d.views, 0) / stats.series.length))}
                />
              </Stack>

              {isOwner && (
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={metric}
                  onChange={(_, v) => v && setMetric(v)}
                  sx={{ mt: 3 }}
                  aria-label="Wykres"
                >
                  {(Object.keys(SERIES_LABELS) as SeriesKey[]).map((k) => (
                    <ToggleButton key={k} value={k}>
                      {SERIES_LABELS[k]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              )}
              <DailyChart series={stats.series} metric={metric} />
            </CardContent>
          </Card>
          ),
              <Section title="Skąd przychodzą odwiedzający" icon={<TravelExploreIcon />}>
              <Typography variant="caption" color="text.secondary">
                Wejścia na stronę w ostatnich {days} dniach: {fmt(stats.sources.reduce((s, i) => s + i.count, 0))}
              </Typography>
              <RankList items={stats.sources} labels={SOURCE_LABELS} empty="Brak wejść w tym okresie." />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                Aplikacja Instagrama często nie przekazuje, skąd ktoś przyszedł – takie wejścia trafiają do
                „Bezpośrednio”. Link w bio z dopiskiem <strong>?utm_source=instagram</strong> (np.
                chlebasmak.pl/?utm_source=instagram) pozwala je policzyć dokładnie. Linki w newsletterze mają taki
                dopisek automatycznie.
              </Typography>
            </Section>,
              <Section title="Najczęściej odwiedzane" icon={<VisibilityIcon />}>
              <Typography variant="caption" color="text.secondary">
                Ostatnie {days} dni
              </Typography>
              <RankList items={stats.pages} labels={PAGE_LABELS} empty="Brak odsłon w tym okresie." />
            </Section>,
              isOwner && (
              <Section title="Rezerwacje" icon={<ReceiptLongIcon />}>
                  <Typography variant="caption" color="text.secondary">
                    Złożone w ostatnich {days} dniach
                  </Typography>
                  <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {fmt(stats.reservations.count - stats.reservations.cancelled)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        przyjętych
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {fmt(stats.reservations.cancelled)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        anulowanych
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {money(stats.reservations.total)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        wartość
                      </Typography>
                    </Box>
                  </Stack>
                  <RankList
                    items={[
                      { key: 'Piekarnie', count: stats.reservations.store },
                      { key: 'Chlebowóz', count: stats.reservations.van },
                    ].filter((i) => i.count > 0)}
                    labels={{}}
                    empty="Brak rezerwacji w tym okresie."
                  />
                  {stats.reservations.topProducts.length > 0 && (
                    <>
                      <Typography variant="subtitle2" sx={{ mt: 3 }}>
                        Najczęściej rezerwowane
                      </Typography>
                      <RankList
                        items={stats.reservations.topProducts.map((p) => ({ key: p.name, count: p.quantity }))}
                        labels={{}}
                        empty=""
                      />
                    </>
                  )}
                </Section>
              ),
              isOwner && (
              <Section title="Mapa Google" icon={<MapIcon />}>
                <LimitBar
                  label="Wczytania mapy w tym miesiącu"
                  value={stats.month.maps}
                  limit={stats.limits.mapsMonthlyFree}
                  forecast={stats.month.forecast.maps}
                  hint={`Darmowa pula Google: ${fmt(stats.limits.mapsMonthlyFree)} miesięcznie. Prognoza na koniec miesiąca: ok. ${fmt(stats.month.forecast.maps)}`}
                />
                <Stack direction="row" spacing={4} sx={{ mt: 2.5 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Dziś
                    </Typography>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>{fmt(stats.todayTotals.maps)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Szacowany koszt w tym miesiącu
                    </Typography>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
                      {money(stats.month.mapsCostPln)}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                  {stats.mapsBySource.map((m) => (
                    <Chip
                      key={m.key}
                      size="small"
                      variant="outlined"
                      label={`${MAP_LABELS[m.key] ?? m.key}: ${fmt(m.count)}`}
                    />
                  ))}
                </Stack>
              </Section>
              ),
            ]}
            right={[
              isOwner && (
              <Section title="Wysyłka e-maili" icon={<MailIcon />}>
                <LimitBar
                  label="Dziś"
                  value={stats.todayTotals.mails}
                  limit={stats.limits.emailDaily}
                  hint="Limit dzienny planu dostawcy"
                />
                {/* dzień wysyłki newslettera = najwięcej e-maili naraz – to on decyduje o dziennym limicie planu */}
                <LimitBar
                  label={`Najwięcej w jednym dniu (${days} dni)`}
                  value={peak.mails}
                  limit={stats.limits.emailDaily}
                  hint={
                    peak.mails > stats.limits.emailDaily
                      ? `${shortDate(peak.date)} wysłano więcej, niż pozwala dzienny limit planu – część e-maili mogła nie dojść. Zwykle to dzień wysyłki newslettera.`
                      : peak.mails > 0
                        ? `${shortDate(peak.date)} – zwykle dzień wysyłki newslettera`
                        : 'Brak wysłanych e-maili w tym okresie'
                  }
                />
                <LimitBar
                  label="W tym miesiącu"
                  value={stats.month.mails}
                  limit={stats.limits.emailMonthly}
                  forecast={stats.month.forecast.mails}
                  hint={
                    <>
                      Prognoza na koniec miesiąca: ok. {fmt(stats.month.forecast.mails)}
                      {stats.month.forecast.mails > stats.limits.emailMonthly &&
                        ' – przekracza limit planu (porównanie planów: dokument 05-Koszty)'}
                    </>
                  }
                />
                {stats.month.mailsFailed > 0 && (
                  <Alert severity="warning" variant="outlined" sx={{ mt: 2 }}>
                    Nieudane wysyłki w tym miesiącu: {stats.month.mailsFailed}
                    {stats.todayTotals.mailsFailed > 0 && ` (dziś: ${stats.todayTotals.mailsFailed})`} – możliwe
                    przekroczenie limitu albo problem z kontem dostawcy.
                  </Alert>
                )}
              </Section>
              ),
              isOwner && (
              <Section title="E-maile według rodzaju" icon={<MailIcon />}>
                  <Typography variant="caption" color="text.secondary">
                    Wysłane w tym miesiącu
                  </Typography>
                  <RankList
                    items={stats.mailsByCategory}
                    labels={MAIL_LABELS}
                    empty="W tym miesiącu nie wysłano jeszcze e-maili."
                  />
                </Section>
              ),
              <ScheduledSection />,
              <NewslettersSection items={stats.newsletters ?? []} />,
              <Section title="Najczęściej oglądane produkty" icon={<BakeryDiningIcon />}>
              <Typography variant="caption" color="text.secondary">
                Wejścia na stronę produktu w ostatnich {days} dniach
              </Typography>
              <RankList
                items={(stats.products ?? []).map((p) => ({ key: p.id, count: p.count }))}
                labels={Object.fromEntries(
                  (stats.products ?? []).map((p) => [p.id, p.active ? p.name : `${p.name} (ukryty na stronie)`]),
                )}
                empty="Nikt jeszcze nie oglądał stron produktów w tym okresie."
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                Pokazuje, co najbardziej ciekawi odwiedzających – warto porównać z najczęściej rezerwowanymi
                produktami. Liczone bez danych osobowych.
              </Typography>
            </Section>,
              <PromotionsSection items={stats.promotions ?? []} />,
            ]}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Statystyki są anonimowe: strona liczy tylko odsłony i wczytania mapy – bez plików cookies, bez zapisywania
            adresów IP i bez śledzenia osób. Odsłony robotów wyszukiwarek nie są liczone.
            {isOwner &&
              ' Limity planów (e-maile, Mapa Google) ustawia osoba administrująca serwerem – przy zmianie planu dostawcy trzeba je zaktualizować.'}
          </Typography>
        </>
      )}
    </Box>
  );
}

const dayMonth = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });

/** Zmiana „przed → w czasie” liczbami i procentem (bez dzielenia przez zero) */
function Change({ before, during }: { before: number; during: number }) {
  if (before === 0 && during === 0)
    return (
      <Typography variant="body2" color="text.disabled">
        —
      </Typography>
    );
  const pct = before === 0 ? null : Math.round(((during - before) / before) * 100);
  const up = during >= before;
  return (
    <Stack spacing={0.25}>
      <Typography variant="body2">
        {fmt(before)} → <strong>{fmt(during)}</strong>
      </Typography>
      <Typography variant="caption" sx={{ color: up ? 'success.main' : 'error.main' }}>
        {pct === null ? 'wcześniej 0' : `${pct > 0 ? '+' : ''}${pct}%`}
      </Typography>
    </Stack>
  );
}

/** Newslettery: do ilu osób, ile wejść na stronę z e-maila, które produkty z kafelków klikano */
function NewslettersSection({ items }: { items: NonNullable<Stats['newsletters']> }) {
  return (
    <Section title="Newslettery" icon={<MarkEmailReadIcon />} sx={{ height: 'auto' }}>
      <Typography variant="caption" color="text.secondary">
        Ostatnie wysyłki – wejścia na stronę z linków w e-mailu (od wysyłki do dziś; jedna osoba może wejść kilka razy,
        np. z przekazanego dalej e-maila). Liczone bez pikseli śledzących, więc samo otwarcie e-maila nie jest widoczne.
      </Typography>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Nie wysłano jeszcze newslettera z licznikiem wejść.
        </Typography>
      ) : (
        <Box sx={{ mt: 1 }}>
          {items.map((n) => (
            <Box key={n.id} sx={{ py: 1.25, borderTop: 1, borderColor: 'divider', '&:first-of-type': { borderTop: 0 } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {n.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(n.sentAt).toLocaleDateString('pl-PL')} · do {fmt(n.recipients)} os. ·{' '}
                <Box component="strong" sx={{ color: 'text.primary' }}>
                  {fmt(n.visits)}
                </Box>{' '}
                wejść
                {/* wejścia to kliknięcia (ta sama osoba może wejść kilka razy) – bez procentu odbiorców */}
                {n.articleVisits > 0 && n.articleVisits !== n.visits && ` (w tym do wpisu: ${fmt(n.articleVisits)})`}
              </Typography>
              {n.products.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Kliknięte produkty: {n.products.map((p) => `${p.name} (${fmt(p.count)})`).join(', ')}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Section>
  );
}

/** Zaplanowane wpisy i newslettery – najbliższe; „Szczegóły” otwiera ekran Marketing → Zaplanowane */
function ScheduledSection() {
  const navigate = useNavigate();
  const [now] = useState(() => Date.now());
  const { data, isPending } = useGetList<ScheduledArticle>('blog', { pagination: { page: 1, perPage: 1000 } });
  const items = scheduledArticles(data ?? [], now);
  const open = () => navigate('/marketing/zaplanowane');
  return (
    <Section
      title="Zaplanowane wpisy i newslettery"
      icon={<EventIcon />}
      sx={{ height: 'auto' }}
      action={{ label: 'Szczegóły', onClick: open }}
    >
      {isPending ? (
        <CircularProgress size={22} sx={{ mt: 2 }} />
      ) : items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Nic nie jest zaplanowane.
        </Typography>
      ) : (
        <Box sx={{ mt: 1, cursor: 'pointer' }} onClick={open}>
          {items.slice(0, 5).map((a) => (
            <Box key={a.id} sx={{ py: 1, borderTop: 1, borderColor: 'divider', '&:first-of-type': { borderTop: 0 } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {a.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(a.publishAt).toLocaleString('pl-PL', { weekday: 'short', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                {' · '}
                {[a.isPublished && 'na stronie', a.sendAsNewsletter && !a.newsletterSentAt && 'newsletter'].filter(Boolean).join(' i ')}
              </Typography>
            </Box>
          ))}
          {items.length > 5 && (
            <Typography variant="caption" color="text.secondary">
              i jeszcze {items.length - 5} – zobacz szczegóły
            </Typography>
          )}
        </Box>
      )}
    </Section>
  );
}

/** Skuteczność promocji: rezerwacje i wyświetlenia w czasie promocji vs tak samo długi okres tuż przed nią */
function PromotionsSection({ items }: { items: NonNullable<Stats['promotions']> }) {
  return (
    <Section title="Skuteczność promocji" icon={<LocalOfferIcon />} sx={{ height: 'auto' }}>
      <Typography variant="caption" color="text.secondary">
        Porównanie z tak samo długim okresem tuż przed promocją. Rezerwacje – zarezerwowane sztuki według dnia odbioru,
        bez anulowanych; sprzedaży w sklepie bez rezerwacji strona nie widzi.
      </Typography>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Nie było jeszcze promocji.
        </Typography>
      ) : (
        <Box sx={{ mt: 1 }}>
          {items.map((p) => (
            <Box key={p.id} sx={{ py: 1.25, borderTop: 1, borderColor: 'divider', '&:first-of-type': { borderTop: 0 } }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {p.name}
                </Typography>
                <Chip
                  size="small"
                  label={p.status === 'active' ? 'trwa' : 'zakończona'}
                  color={p.status === 'active' ? 'success' : 'default'}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {p.promoPrice != null ? (
                  <>
                    <s>{money(p.price)}</s> {money(p.promoPrice)}
                  </>
                ) : (
                  'tylko etykieta'
                )}{' '}
                · {dayMonth(p.from)} – {p.to ? dayMonth(p.to) : 'bez końca'} ({p.status === 'active' ? 'do dziś: ' : ''}
                {p.days} {p.days === 1 ? 'dzień' : 'dni'})
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 1.5, rowGap: 0.25, mt: 0.75 }}>
                <Typography variant="caption" color="text.secondary">
                  Rezerwacje (szt.)
                </Typography>
                <Change before={p.before.quantity} during={p.during.quantity} />
                <Typography variant="caption" color="text.secondary">
                  Wyświetlenia
                </Typography>
                <Change before={p.before.views} during={p.during.views} />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Section>
  );
}
