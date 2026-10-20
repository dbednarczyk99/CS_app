import { UnsavedChangesDialog } from '../common/UnsavedChanges';
import { useEffect, useState } from 'react';
import { Title, useNotify } from 'react-admin';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { apiUrl, httpClient } from '../../dataProvider';
import { VersionHistory } from '../content/VersionHistory';
import { fetchRevisions } from '../content/revisions';

interface Rules {
  cutoffTime: string;
  maxDaysAhead: number;
  maxActivePerPhone: number;
  summaryEnabled: boolean;
  summaryTime: string;
  summaryEmails: string[];
}

/** W formularzu adresy e-mail jako tekst (po jednym w linii) */
type Form = Omit<Rules, 'summaryEmails' | 'maxDaysAhead' | 'maxActivePerPhone'> & {
  maxDaysAhead: string;
  maxActivePerPhone: string;
  summaryEmails: string;
};

const toForm = (r: Rules): Form => ({
  ...r,
  maxDaysAhead: String(r.maxDaysAhead),
  maxActivePerPhone: String(r.maxActivePerPhone),
  summaryEmails: r.summaryEmails.join('\n'),
});

const toPayload = (f: Form) => ({
  ...f,
  maxDaysAhead: Number(f.maxDaysAhead),
  maxActivePerPhone: Number(f.maxActivePerPhone),
  summaryEmails: f.summaryEmails
    .split(/[\s,;]+/)
    .map((e) => e.trim())
    .filter(Boolean),
});

const days = (n: number) => `${n} ${n === 1 ? 'dzień' : 'dni'}`;

/** Krótki opis wersji na liście historii */
const summarize = (d: Record<string, unknown>) =>
  `do ${d.cutoffTime}, ${days(Number(d.maxDaysAhead))} do przodu, limit ${d.maxActivePerPhone} · zestawienie ${
    d.summaryEnabled ? `o ${d.summaryTime}` : 'wyłączone'
  }`;

/** Przykład działania zasad na dziś – żeby było jasne, co zobaczy klient */
function Example({ form }: { form: Form }) {
  const n = Number(form.maxDaysAhead);
  if (!/^\d{2}:\d{2}$/.test(form.cutoffTime) || !Number.isInteger(n) || n < 1) return null;
  const fmt = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  return (
    <Alert severity="info" icon={false} sx={{ mt: 1 }}>
      Przykład na dziś: do {form.cutoffTime} klient może zarezerwować odbiór od jutra ({fmt(1)}), po {form.cutoffTime} – od
      pojutrza{n < 2 ? ' (przy 1 dniu do przodu: po tej godzinie nie ma już terminów)' : ` (${fmt(2)})`}. Najdalszy termin:{' '}
      {fmt(n)}. Anulować rezerwację można do {form.cutoffTime} dnia przed odbiorem.
    </Alert>
  );
}

/**
 * Rezerwacje → Zasady rezerwacji (tylko administrator): godzina zamknięcia, liczba dni do przodu, limit na telefon
 * i codzienne zestawienie „do przygotowania”. Zmiana działa od razu w formularzu, e-mailach i regulaminie.
 */
export default function ReservationRulesPage() {
  const notify = useNotify();
  const [saved, setSaved] = useState<{ value: Rules; defaults: Rules; updatedAt: string | null } | null | undefined>();
  const [form, setForm] = useState<Form | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState<string | null>(null);

  useEffect(() => {
    httpClient(`${apiUrl}/settings/reservations`)
      .then(({ json }) => {
        setSaved(json);
        setForm(toForm(json.value));
      })
      .catch(() => setSaved(null));
  }, []);

  if (saved === undefined) return <CircularProgress sx={{ m: 4 }} />;
  if (saved === null || !form)
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        Nie udało się wczytać ustawień – odśwież stronę.
      </Alert>
    );

  const original = toForm(saved.value);
  const dirty = JSON.stringify(form) !== JSON.stringify(original);
  const isDefault = JSON.stringify(toPayload(form)) === JSON.stringify(saved.defaults);
  const set = (patch: Partial<Form>) => setForm((f) => (f ? { ...f, ...patch } : f));
  const load = (data: Record<string, unknown>, label: string) => {
    setForm(toForm(data as unknown as Rules));
    setLoaded(label);
    setErrors([]);
  };

  const save = async () => {
    setSaving(true);
    setErrors([]);
    try {
      const { json } = await httpClient(`${apiUrl}/settings/reservations`, {
        method: 'PUT',
        body: JSON.stringify(toPayload(form)),
      });
      setSaved({ ...saved, value: json as Rules, updatedAt: new Date().toISOString() });
      setForm(toForm(json as Rules));
      setLoaded(null);
      notify('Zapisano – nowe zasady obowiązują od razu', { type: 'success' });
    } catch (error) {
      const message = (error as { body?: { message?: string | string[] } }).body?.message;
      setErrors(Array.isArray(message) ? message : [message ?? 'Nie udało się zapisać']);
    } finally {
      setSaving(false);
    }
  };

  const field = { variant: 'filled' as const, size: 'small' as const };

  return (
    <Box sx={{ maxWidth: 820, mx: 'auto', py: { xs: 2, md: 4 } }}>
      <Title title="Zasady rezerwacji" />
      <UnsavedChangesDialog when={dirty && !saving} />
      <Typography variant="h5">Zasady rezerwacji</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
        Zmiana działa od razu: w formularzu rezerwacji, komunikatach, e-mailach do klientów, na stronach produktów i w
        regulaminie (tam, gdzie są znaczniki {'{godzina}'}, {'{dni}'}, {'{limit}'}).
      </Typography>
      <Alert severity="warning" sx={{ mb: 3 }}>
        Zasady rezerwacji są częścią regulaminu. Przy istotnej zmianie (np. krótszy czas na anulowanie) zaktualizuj datę
        „Obowiązuje od” w regulaminie (Strona → Dokumenty prawne) i poinformuj klientów, np. banerem albo w
        newsletterze. Rezerwacje już złożone podlegają nowej godzinie anulowania.
      </Alert>

      {loaded && dirty && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Wczytano {loaded}. Sprawdź i kliknij „Zapisz”, aby przywrócić – albo „Cofnij zmiany”.
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Rezerwacje
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            {...field}
            type="time"
            label="Zamknięcie rezerwacji i anulowania"
            value={form.cutoffTime}
            onChange={(e) => set({ cutoffTime: e.target.value })}
            helperText="dnia poprzedzającego odbiór"
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { step: 300 } }}
            sx={{ flex: 1 }}
          />
          <TextField
            {...field}
            type="number"
            label="Ile dni do przodu"
            value={form.maxDaysAhead}
            onChange={(e) => set({ maxDaysAhead: e.target.value })}
            helperText="od 1 do 14"
            slotProps={{ htmlInput: { min: 1, max: 14 } }}
            sx={{ flex: 1 }}
          />
          <TextField
            {...field}
            type="number"
            label="Limit na jeden telefon"
            value={form.maxActivePerPhone}
            onChange={(e) => set({ maxActivePerPhone: e.target.value })}
            helperText="aktywnych rezerwacji naraz (1–20)"
            slotProps={{ htmlInput: { min: 1, max: 20 } }}
            sx={{ flex: 1 }}
          />
        </Stack>
        <Example form={form} />
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Zestawienie „do przygotowania”
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Codzienny e-mail z listą produktów do przygotowania na jutro (to samo, co w „Do przygotowania” → „Wyślij
          e-mailem”).
        </Typography>
        <FormControlLabel
          control={<Switch checked={form.summaryEnabled} onChange={(e) => set({ summaryEnabled: e.target.checked })} />}
          label="Wysyłaj codziennie"
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1.5 }}>
          <TextField
            {...field}
            type="time"
            label="Godzina wysyłki"
            value={form.summaryTime}
            onChange={(e) => set({ summaryTime: e.target.value })}
            helperText="po zamknięciu rezerwacji – wtedy lista na jutro jest pełna"
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { step: 300 } }}
            disabled={!form.summaryEnabled}
            sx={{ flex: 1 }}
          />
          <TextField
            {...field}
            label="Adresy e-mail"
            value={form.summaryEmails}
            onChange={(e) => set({ summaryEmails: e.target.value })}
            helperText="po jednym w linii, najwyżej 5; puste – e-mail z „Dane kontaktowe”"
            multiline
            minRows={2}
            disabled={!form.summaryEnabled}
            sx={{ flex: 1.4 }}
          />
        </Stack>
      </Paper>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.map((e) => (
            <div key={e}>{e}</div>
          ))}
        </Alert>
      )}

      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
        <Button variant="contained" onClick={save} disabled={!dirty || saving}>
          {saving ? 'Zapisywanie…' : 'Zapisz'}
        </Button>
        {dirty && (
          <Button
            onClick={() => {
              setForm(original);
              setLoaded(null);
              setErrors([]);
            }}
            disabled={saving}
          >
            Cofnij zmiany
          </Button>
        )}
        <VersionHistory
          revisions={() => fetchRevisions(`${apiUrl}/settings/reservations/revisions`)}
          load={load}
          summary={summarize}
        />
        <Button
          color="inherit"
          startIcon={<RestartAltIcon />}
          disabled={isDefault}
          onClick={() => load(saved.defaults as unknown as Record<string, unknown>, 'zasady domyślne (z dnia uruchomienia strony)')}
        >
          Przywróć stan domyślny
        </Button>
        {saved.updatedAt && (
          <Typography variant="caption" color="text.secondary">
            Zmieniono {new Date(saved.updatedAt).toLocaleString('pl-PL')}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
