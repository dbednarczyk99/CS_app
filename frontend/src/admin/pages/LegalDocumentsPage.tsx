import { UnsavedChangesDialog } from '../common/UnsavedChanges';
import { useEffect, useState } from 'react';
import { Title, useNotify } from 'react-admin';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { apiUrl, httpClient } from '../../dataProvider';
import { MarkdownPreview } from '../common/MarkdownPreview';
import { placeholders } from '../common/markdown';
import { VersionHistory } from '../content/VersionHistory';
import { fetchRevisions } from '../content/revisions';

const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:3001';

const DOCS = [
  { doc: 'regulamin', label: 'Regulamin rezerwacji', path: '/regulamin' },
  { doc: 'polityka-prywatnosci', label: 'Polityka prywatności', path: '/polityka-prywatnosci' },
];

interface LegalData {
  title: string;
  markdown: string;
  defaults: string;
  updatedAt: string | null;
  customized: boolean;
}

type Rules = { cutoffTime: string; maxDaysAhead: number; maxActivePerPhone: number };

/** Znaczniki zasad → aktualne wartości (jak na stronie) */
const fillRules = (text: string, r: Rules | null) =>
  r
    ? text
        .replace(/\{godzina\}/g, r.cutoffTime)
        .replace(/\{dni\}/g, `${r.maxDaysAhead} ${r.maxDaysAhead === 1 ? 'dzień' : 'dni'}`)
        .replace(/\{limit\}/g, String(r.maxActivePerPhone))
    : text;

/** Pierwszy wiersz wersji na liście historii: data „Obowiązuje od” albo początek tekstu */
const summarize = (d: Record<string, unknown>) => {
  const md = String(d.markdown ?? '');
  const since = md.match(/Obowiązuje od:\s*(.+)/)?.[1];
  return since ? `Obowiązuje od: ${since.replace(/\[\[|\]\]/g, '')}` : `${md.length} znaków`;
};

function DocumentEditor({ doc, path, rules }: { doc: string; path: string; rules: Rules | null }) {
  const notify = useNotify();
  const [data, setData] = useState<LegalData | null | undefined>();
  const [value, setValue] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [loaded, setLoaded] = useState<string | null>(null);

  useEffect(() => {
    httpClient(`${apiUrl}/settings/legal/${doc}/panel`)
      .then(({ json }) => {
        setData(json);
        setValue(json.markdown);
      })
      .catch(() => setData(null));
  }, [doc]);

  if (data === undefined) return <CircularProgress sx={{ m: 4 }} />;
  if (data === null) return <Alert severity="error">Nie udało się wczytać dokumentu – odśwież stronę.</Alert>;

  const dirty = value.trim() !== data.markdown.trim();
  const isDefault = value.trim() === data.defaults.trim();
  const missing = placeholders(value);
  const load = (d: Record<string, unknown>, label: string) => {
    setValue(String(d.markdown ?? ''));
    setLoaded(label);
    setErrors([]);
  };

  const save = async () => {
    setConfirm(false);
    setSaving(true);
    setErrors([]);
    try {
      const { json } = await httpClient(`${apiUrl}/settings/legal/${doc}`, {
        method: 'PUT',
        body: JSON.stringify({ markdown: value }),
      });
      setData({ ...data, ...json, customized: true });
      setValue(json.markdown);
      setLoaded(null);
      notify('Opublikowano nową wersję dokumentu', { type: 'success' });
    } catch (error) {
      const message = (error as { body?: { message?: string | string[] } }).body?.message;
      setErrors(Array.isArray(message) ? message : [message ?? 'Nie udało się zapisać']);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <UnsavedChangesDialog when={dirty && !saving} />
      {missing.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          W dokumencie {missing.length === 1 ? 'jest 1 pole' : `są pola (${missing.length})`} do uzupełnienia w podwójnych
          nawiasach, np. {missing.slice(0, 3).join(', ')}
          {missing.length > 3 ? '…' : ''}. Na stronie są wyróżnione na żółto – przed startem strony uzupełnij je (najlepiej z
          prawnikiem).
        </Alert>
      )}
      {loaded && dirty && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Wczytano {loaded}. Sprawdź i kliknij „Zapisz i opublikuj”, aby przywrócić – albo „Cofnij zmiany”.
        </Alert>
      )}

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems="stretch">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary">
            Treść
          </Typography>
          <TextField
            value={value}
            onChange={(e) => setValue(e.target.value)}
            multiline
            fullWidth
            minRows={24}
            maxRows={40}
            slotProps={{ htmlInput: { spellCheck: true, style: { fontFamily: 'Consolas, monospace', fontSize: 13, lineHeight: 1.55 } } }}
          />
          <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1, lineHeight: 1.6 }}>
            # Tytuł · ## Rozdział · ### Podrozdział · **pogrubienie** · „1.” / „-” na początku linii – lista (wcięcie =
            podpunkt) · {'>'} cytat · [[pole do uzupełnienia]] · pusta linia – nowy akapit. Zasady z „Zasady rezerwacji”:{' '}
            {'{godzina}'}, {'{dni}'}, {'{limit}'} – wstawiane automatycznie. {value.length.toLocaleString('pl-PL')} znaków.
          </Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary">
            Podgląd (jak na stronie)
          </Typography>
          <Paper variant="outlined" sx={{ p: 3, maxHeight: { lg: 720 }, overflowY: 'auto' }}>
            <MarkdownPreview source={fillRules(value, rules)} />
          </Paper>
        </Box>
      </Stack>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.map((e) => (
            <div key={e}>{e}</div>
          ))}
        </Alert>
      )}

      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => setConfirm(true)} disabled={!dirty || saving}>
          {saving ? 'Zapisywanie…' : 'Zapisz i opublikuj'}
        </Button>
        {dirty && (
          <Button
            onClick={() => {
              setValue(data.markdown);
              setLoaded(null);
              setErrors([]);
            }}
            disabled={saving}
          >
            Cofnij zmiany
          </Button>
        )}
        <VersionHistory revisions={() => fetchRevisions(`${apiUrl}/settings/legal/${doc}/revisions`)} load={load} summary={summarize} />
        <Button
          color="inherit"
          startIcon={<RestartAltIcon />}
          disabled={isDefault}
          onClick={() => load({ markdown: data.defaults }, 'wersję domyślną (projekt dokumentu z dnia uruchomienia strony)')}
        >
          Przywróć stan domyślny
        </Button>
        <Link href={`${webUrl}${path}`} target="_blank" rel="noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          Zobacz na stronie <OpenInNewIcon fontSize="inherit" />
        </Link>
        {data.updatedAt && (
          <Typography variant="caption" color="text.secondary">
            Zmieniono {new Date(data.updatedAt).toLocaleString('pl-PL')}
          </Typography>
        )}
      </Stack>

      <Dialog open={confirm} onClose={() => setConfirm(false)}>
        <DialogTitle>Opublikować nową wersję?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Nowa treść od razu pojawi się na stronie, a poprzednia trafi do „Wcześniejsze wersje” (historia zmian zostaje
            cała). Jeśli zmiana jest istotna, zaktualizuj też datę „Obowiązuje od” i poinformuj klientów (np. w
            newsletterze).
          </Typography>
          {missing.length > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Dokument ma jeszcze pola do uzupełnienia ({missing.length}).
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(false)}>Anuluj</Button>
          <Button variant="contained" onClick={save}>
            Opublikuj
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/** Strona → Dokumenty prawne (tylko administrator): regulamin i polityka prywatności z podglądem i historią */
export default function LegalDocumentsPage() {
  const { doc } = useParams();
  const navigate = useNavigate();
  const current = DOCS.find((d) => d.doc === doc) ?? DOCS[0];
  const [rules, setRules] = useState<Rules | null>(null);

  useEffect(() => {
    httpClient(`${apiUrl}/settings/reservations/public`)
      .then(({ json }) => setRules(json))
      .catch(() => undefined);
  }, []);

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', py: { xs: 2, md: 3 } }}>
      <Title title={`Dokumenty prawne – ${current.label}`} />
      <Typography variant="h5">Dokumenty prawne</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Treść regulaminu i polityki prywatności na stronie. Wersja startowa to projekt przygotowany na podstawie działania
        strony – przed uruchomieniem strony powinien go sprawdzić prawnik.
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 2 }}>
        <Tabs value={current.doc} onChange={(_, v: string) => navigate(`/ustawienia/dokumenty/${v}`)}>
          {DOCS.map((d) => (
            <Tab key={d.doc} value={d.doc} label={d.label} />
          ))}
        </Tabs>
      </Box>
      {/* key – nowa zakładka wczytuje swój dokument */}
      <DocumentEditor key={current.doc} doc={current.doc} path={current.path} rules={rules} />
    </Box>
  );
}
