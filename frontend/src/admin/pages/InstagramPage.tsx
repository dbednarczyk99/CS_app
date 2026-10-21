import { useEffect, useState } from 'react';
import { Title, useNotify } from 'react-admin';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Link,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InstagramIcon from '@mui/icons-material/Instagram';
import RefreshIcon from '@mui/icons-material/Refresh';
import { apiUrl, httpClient } from '../../dataProvider';
import { UnsavedChangesDialog } from '../common/UnsavedChanges';

interface Post {
  id: string;
  permalink: string;
  image: string;
  caption: string;
  takenAt: string;
}
interface State {
  enabled: boolean;
  hasToken: boolean;
  tokenUpdatedAt: string | null;
  tokenExpiresAt: string | null;
  visible: boolean;
  feed: {
    username: string | null;
    posts: Post[];
    fetchedAt: string | null;
    lastAttemptAt: string | null;
    error: string | null;
  };
}

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString('pl-PL') : '—');
const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('pl-PL') : '—');

/**
 * Marketing → Instagram: połączenie z kontem piekarni (klucz dostępu), włącznik sekcji na stronie,
 * stan ostatniego pobrania i podgląd postów. Gdy coś nie działa, sekcja na stronie sama się ukrywa.
 */
export default function InstagramPage() {
  const notify = useNotify();
  const [state, setState] = useState<State | null | undefined>();
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState<'save' | 'refresh' | null>(null);

  useEffect(() => {
    httpClient(`${apiUrl}/instagram/admin`)
      .then(({ json }) => setState(json))
      .catch(() => setState(null));
  }, []);

  if (state === undefined) return <CircularProgress sx={{ m: 4 }} />;
  if (state === null) return <Alert severity="error" sx={{ m: 4 }}>Nie udało się wczytać ustawień – odśwież stronę.</Alert>;

  const call = async (kind: 'save' | 'refresh', path: string, method: string, body?: object) => {
    setBusy(kind);
    try {
      const { json } = await httpClient(`${apiUrl}/instagram/admin${path}`, {
        method,
        body: body ? JSON.stringify(body) : undefined,
      });
      setState(json as State);
      return json as State;
    } catch (error) {
      const message = (error as { body?: { message?: string | string[] } }).body?.message;
      notify(Array.isArray(message) ? message[0] : (message ?? 'Nie udało się zapisać'), { type: 'error' });
      return null;
    } finally {
      setBusy(null);
    }
  };

  const saveToken = async () => {
    const next = await call('save', '', 'PUT', { token, enabled: true });
    if (!next) return;
    setToken('');
    notify(next.visible ? 'Połączono – posty są już na stronie' : 'Klucz zapisany, ale pobranie postów się nie udało – zobacz komunikat', {
      type: next.visible ? 'success' : 'warning',
    });
  };

  const status = !state.hasToken
    ? { label: 'Nie połączono', color: 'default' as const }
    : !state.enabled
      ? { label: 'Wyłączone – sekcja ukryta', color: 'default' as const }
      : state.visible
        ? { label: 'Działa – sekcja widoczna', color: 'success' as const }
        : { label: 'Nie działa – sekcja ukryta', color: 'warning' as const };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: { xs: 2, md: 4 } }}>
      <Title title="Instagram" />
      <UnsavedChangesDialog when={!busy && token.trim().length > 0} />
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
        <InstagramIcon color="primary" />
        <Typography variant="h5" sx={{ flex: 1 }}>
          Instagram na stronie
        </Typography>
        <Chip label={status.label} color={status.color} />
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Ostatnie posty z Instagrama piekarni na stronie głównej i w kontakcie. Strona sprawdza nowe posty co 3 godziny
        i pokazuje ich kopie z naszego serwera. Gdy połączenie z Instagramem nie działa (np. wygasł klucz), sekcja
        na stronie sama się ukrywa – nic się nie psuje. Tytuł i napis przycisku zmienisz w „Podstrony” → „Elementy
        wspólne”.
      </Typography>

      <Stack spacing={2}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6">Połączenie</Typography>
          {state.hasToken ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Konto: <strong>{state.feed.username ? `@${state.feed.username}` : '—'}</strong> · klucz zapisany{' '}
              {day(state.tokenUpdatedAt)}, ważny mniej więcej do {day(state.tokenExpiresAt)} – odnawia się sam co
              tydzień.
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Wklej klucz dostępu z konta piekarni – instrukcja poniżej.
            </Typography>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }} alignItems={{ sm: 'flex-start' }}>
            <TextField
              label={state.hasToken ? 'Nowy klucz dostępu (zastąpi obecny)' : 'Klucz dostępu (access token)'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              autoComplete="off"
              size="small"
              variant="filled"
              fullWidth
            />
            <Button variant="contained" onClick={saveToken} disabled={!token.trim() || !!busy} sx={{ flexShrink: 0, py: 1.4 }}>
              {busy === 'save' ? 'Łączenie…' : 'Zapisz i połącz'}
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={state.enabled}
                  disabled={!state.hasToken || !!busy}
                  onChange={(e) => void call('save', '', 'PUT', { enabled: e.target.checked })}
                />
              }
              label="Pokazuj sekcję na stronie"
            />
            <Button
              startIcon={<RefreshIcon />}
              disabled={!state.hasToken || !state.enabled || !!busy}
              onClick={() => void call('refresh', '/refresh', 'POST')}
            >
              {busy === 'refresh' ? 'Pobieranie…' : 'Pobierz posty teraz'}
            </Button>
            {state.hasToken && (
              <Button color="error" disabled={!!busy} onClick={() => void call('save', '', 'PUT', { token: '', enabled: false })}>
                Odłącz konto
              </Button>
            )}
          </Stack>
          {state.hasToken && state.feed.error && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Ostatnie pobranie ({when(state.feed.lastAttemptAt)}) się nie udało: {state.feed.error}. Sekcja na
              stronie jest ukryta do czasu udanego pobrania.
            </Alert>
          )}
          {state.hasToken && !state.feed.error && state.feed.fetchedAt && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
              Ostatnie pobranie: {when(state.feed.fetchedAt)}
              {state.feed.posts.length < 3 && ' – na koncie są mniej niż 3 posty, więc sekcja jest ukryta'}
            </Typography>
          )}
        </Paper>

        {state.feed.posts.length > 0 && (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Posty na stronie
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(6, 1fr)' }, gap: 1 }}>
              {state.feed.posts.map((post) => (
                <Box
                  key={post.id}
                  component="a"
                  href={post.permalink}
                  target="_blank"
                  rel="noreferrer"
                  title={post.caption}
                  sx={{ display: 'block', aspectRatio: '1', overflow: 'hidden', bgcolor: 'action.hover' }}
                >
                  <img src={`${apiUrl}${post.image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Strona pokazuje 8 najnowszych (dwa pełne rzędy). Usunięty post znika ze strony przy następnym pobraniu.
            </Typography>
          </Paper>
        )}

        <Accordion variant="outlined" disableGutters defaultExpanded={!state.hasToken}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Jak połączyć konto (jednorazowo, ok. 15 minut)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography component="ol" variant="body2" sx={{ pl: 2.5, m: 0, '& li': { mb: 1 } }}>
              <li>
                Konto piekarni na Instagramie musi być <strong>firmowe albo twórcy</strong> (w aplikacji: Ustawienia →
                Typ konta i narzędzia).
              </li>
              <li>
                Wejdź na{' '}
                <Link href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer">
                  developers.facebook.com/apps
                </Link>
                , zaloguj się i utwórz aplikację (typ „Firma”, przypadek użycia związany z Instagramem – „Instagram
                API”). To darmowe i nie wymaga publikowania aplikacji.
              </li>
              <li>
                W ustawieniach aplikacji wybierz „Instagram API with Instagram Login” → „Generate access tokens” →
                dodaj konto piekarni (zaloguj się nim i zatwierdź dostęp).
              </li>
              <li>Skopiuj wygenerowany klucz (długi ciąg znaków) i wklej go powyżej → „Zapisz i połącz”.</li>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Nazwy przycisków u Meta czasem się zmieniają. Klucz jest ważny 60 dni, a strona odnawia go sama – trzeba
              go wkleić ponownie tylko wtedy, gdy zmienisz hasło do Instagrama albo odłączysz aplikację.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Box>
  );
}
