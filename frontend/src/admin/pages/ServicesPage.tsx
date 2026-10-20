import { UnsavedChangesDialog } from '../common/UnsavedChanges';
import { useEffect, useState, type ReactNode } from 'react';
import { Title, useNotify } from 'react-admin';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  LinearProgress,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import MapIcon from '@mui/icons-material/Map';
import StarIcon from '@mui/icons-material/Star';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { apiUrl, httpClient } from '../../dataProvider';
import { VersionHistory } from '../content/VersionHistory';
import { fetchRevisions } from '../content/revisions';

type Key = 'emails' | 'maps' | 'ratings';
interface Settings {
  emailsEnabled: boolean;
  mapsEnabled: boolean;
  ratingsEnabled: boolean;
  emailDailyLimit: number;
  mapsDailyLimit: number;
  ratingsDailyLimit: number;
}
interface State {
  enabled: boolean;
  limit: number;
  usedToday: number;
  available: boolean;
  reason: 'off' | 'limit' | null;
}
interface Data {
  value: Settings;
  defaults: Settings;
  updatedAt: string | null;
  state: Record<Key, State>;
}

const SERVICES: {
  key: Key;
  enabled: 'emailsEnabled' | 'mapsEnabled' | 'ratingsEnabled';
  limit: 'emailDailyLimit' | 'mapsDailyLimit' | 'ratingsDailyLimit';
  title: string;
  icon: ReactNode;
  unit: string;
  what: string;
  whenOff: string;
  limitHelp: string;
}[] = [
  {
    key: 'emails',
    enabled: 'emailsEnabled',
    limit: 'emailDailyLimit',
    title: 'E-maile',
    icon: <MailIcon />,
    unit: 'e-maili',
    what: 'Potwierdzenia i anulowania rezerwacji, newsletter, potwierdzenia zapisu, formularz kontaktowy, zestawienie „do przygotowania”.',
    whenOff:
      'Rezerwacje dalej działają – klient zobaczy numer rezerwacji z prośbą o jego zapisanie (bez e-maila). Zapisy do newslettera i formularz kontaktowy są wstrzymane z komunikatem; zaplanowane newslettery czekają i wyjdą po włączeniu.',
    limitHelp: 'Plan dostawcy zwykle: 100 dziennie. Newsletter liczy się jako 1 e-mail na każdego subskrybenta.',
  },
  {
    key: 'maps',
    enabled: 'mapsEnabled',
    limit: 'mapsDailyLimit',
    title: 'Mapa Google',
    icon: <MapIcon />,
    unit: 'wczytań',
    what: 'Interaktywna mapa na stronach Piekarnie, Chlebowóz i w formularzu rezerwacji.',
    whenOff: 'Zamiast mapy strona pokazuje listę adresów z linkami „otwórz w Mapach Google” (bez kosztów po naszej stronie).',
    limitHelp: 'Darmowa pula Google: 10 000 wczytań miesięcznie ≈ 320 dziennie. Stan odświeża się co ok. minutę.',
  },
  {
    key: 'ratings',
    enabled: 'ratingsEnabled',
    limit: 'ratingsDailyLimit',
    title: 'Oceny Google',
    icon: <StarIcon />,
    unit: 'zapytań',
    what: 'Odświeżanie gwiazdek i liczby opinii piekarni (codziennie rano i przyciskiem „Odśwież ocenę” w piekarni).',
    whenOff: 'Strona pokazuje ostatnią zapisaną ocenę – nic nie znika.',
    limitHelp: 'Jedno zapytanie na piekarnię przy każdym odświeżeniu (zwykle kilka dziennie).',
  },
];

const summarize = (d: Record<string, unknown>) =>
  SERVICES.map((s) => `${s.title}: ${d[s.enabled] ? `do ${d[s.limit]}/dzień` : 'wyłączone'}`).join(' · ');

/**
 * Ustawienia → Usługi i koszty (tylko administrator): wyłącznik i twardy limit dzienny każdej płatnej usługi,
 * z dzisiejszym zużyciem. Wyłączona albo po limicie (do północy) – strona pokazuje zamiennik zamiast błędu.
 */
export default function ServicesPage() {
  const notify = useNotify();
  const [data, setData] = useState<Data | null | undefined>();
  const [form, setForm] = useState<Settings | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    httpClient(`${apiUrl}/settings/services`)
      .then(({ json }) => {
        setData(json);
        setForm(json.value);
      })
      .catch(() => setData(null));
  }, []);

  if (data === undefined) return <CircularProgress sx={{ m: 4 }} />;
  if (data === null || !form) return <Alert severity="error" sx={{ m: 4 }}>Nie udało się wczytać ustawień – odśwież stronę.</Alert>;

  const dirty = JSON.stringify(form) !== JSON.stringify(data.value);
  const isDefault = JSON.stringify(form) === JSON.stringify(data.defaults);

  const save = async () => {
    setSaving(true);
    setErrors([]);
    try {
      const { json } = await httpClient(`${apiUrl}/settings/services`, {
        method: 'PUT',
        body: JSON.stringify({ ...form, emailDailyLimit: Number(form.emailDailyLimit), mapsDailyLimit: Number(form.mapsDailyLimit), ratingsDailyLimit: Number(form.ratingsDailyLimit) }),
      });
      setData(json);
      setForm(json.value);
      notify('Zapisano – zmiana działa od razu (mapa na stronie w ciągu ok. minuty)', { type: 'success' });
    } catch (error) {
      const message = (error as { body?: { message?: string | string[] } }).body?.message;
      setErrors(Array.isArray(message) ? message : [message ?? 'Nie udało się zapisać']);
    } finally {
      setSaving(false);
    }
  };

  const blocked = SERVICES.filter((s) => !data.state[s.key].available);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: { xs: 2, md: 4 } }}>
      <Title title="Usługi i koszty" />
      <UnsavedChangesDialog when={dirty && !saving} />
      <Typography variant="h5">Usługi i koszty</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
        Wyłączniki płatnych usług na wypadek nieoczekiwanych kosztów (np. ataku na formularze albo błędu strony). Każda
        usługa ma też twardy limit dzienny – po jego przekroczeniu wyłącza się sama do północy. Strona zamiast błędu
        pokazuje wtedy zamiennik.
      </Typography>
      {blocked.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Teraz nie działa: {blocked.map((s) => `${s.title} (${data.state[s.key].reason === 'off' ? 'wyłączone' : 'limit dzienny'})`).join(', ')}.
        </Alert>
      )}

      <Stack spacing={2}>
        {SERVICES.map((s) => {
          const state = data.state[s.key];
          const percent = Math.min(100, (state.usedToday / Math.max(1, state.limit)) * 100);
          return (
            <Paper key={s.key} variant="outlined" sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
                <Box sx={{ color: 'primary.main', display: 'flex' }}>{s.icon}</Box>
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {s.title}
                </Typography>
                <Chip
                  size="small"
                  color={state.available ? 'success' : 'warning'}
                  label={state.available ? 'Działa' : state.reason === 'off' ? 'Wyłączone' : 'Limit dzienny – do północy'}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {s.what}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Dziś</Typography>
                  <Typography variant="body2">
                    <strong>{state.usedToday}</strong> / {state.limit} {s.unit}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={percent}
                  color={percent >= 100 ? 'error' : percent >= 80 ? 'warning' : 'primary'}
                  sx={{ mt: 0.75, height: 6, borderRadius: 1 }}
                />
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mt: 2.5 }}>
                <FormControlLabel
                  control={<Switch checked={form[s.enabled]} onChange={(e) => setForm({ ...form, [s.enabled]: e.target.checked })} />}
                  label={form[s.enabled] ? 'Włączone' : 'Wyłączone'}
                  sx={{ minWidth: 150 }}
                />
                <TextField
                  type="number"
                  size="small"
                  variant="filled"
                  label="Limit dzienny"
                  value={form[s.limit]}
                  onChange={(e) => setForm({ ...form, [s.limit]: e.target.value as unknown as number })}
                  helperText={s.limitHelp}
                  sx={{ flex: 1 }}
                />
              </Stack>
              <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
                <strong>Gdy nie działa:</strong> {s.whenOff}
              </Alert>
            </Paper>
          );
        })}
      </Stack>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.map((e) => (
            <div key={e}>{e}</div>
          ))}
        </Alert>
      )}

      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
        <Button variant="contained" onClick={save} disabled={!dirty || saving}>
          {saving ? 'Zapisywanie…' : 'Zapisz'}
        </Button>
        {dirty && <Button onClick={() => setForm(data.value)}>Cofnij zmiany</Button>}
        <VersionHistory
          revisions={() => fetchRevisions(`${apiUrl}/settings/services/revisions`)}
          load={(d) => setForm(d as unknown as Settings)}
          summary={summarize}
        />
        <Button color="inherit" startIcon={<RestartAltIcon />} disabled={isDefault} onClick={() => setForm(data.defaults)}>
          Przywróć stan domyślny
        </Button>
        {data.updatedAt && (
          <Typography variant="caption" color="text.secondary">
            Zmieniono {new Date(data.updatedAt).toLocaleString('pl-PL')}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
