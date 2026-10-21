import { useState, type FormEvent, type ReactNode } from 'react';
import { LoginForm } from 'react-admin';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Card, CardContent, Link, TextField, Typography } from '@mui/material';
import { COLORS } from '../../theme';
import { PasswordChecklist } from './PasswordChecklist';
import { isStrongPassword } from './password-rules';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/** Wspólna oprawa ekranów logowania: zdjęcie z piekarni w tle, logo, złoty akcent; zawsze ciemne */
function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 2,
        background: `linear-gradient(rgba(20, 22, 24, 0.78), rgba(20, 22, 24, 0.94)), url(/logowanie.jpg) center / cover no-repeat`,
        backgroundColor: COLORS.ink,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: 'min(420px, 100%)',
          bgcolor: 'rgba(26, 29, 32, 0.92)',
          backdropFilter: 'blur(6px)',
          border: `1px solid ${COLORS.line}`,
          borderTop: `2px solid ${COLORS.gold}`,
          color: COLORS.cream,
        }}
      >
        <CardContent sx={{ px: { xs: 3, sm: 5 }, pt: 5, pb: 3 }}>
          <Box component="img" src="/logo-poziome-biale.png" alt="Chleba Smak" sx={{ display: 'block', width: 210, mb: 4 }} />
          <Typography variant="overline" sx={{ color: COLORS.gold, display: 'block', lineHeight: 1.6 }}>
            Panel administracyjny
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5, mb: 1 }}>
            {title}
          </Typography>
          <Box sx={{ width: 48, height: 2, bgcolor: COLORS.gold, mb: 1 }} />
        </CardContent>
        <Box sx={{ px: { xs: 3, sm: 5 }, pb: 4 }}>{children}</Box>
      </Card>
      <Typography variant="caption" sx={{ color: COLORS.stone, textAlign: 'center' }}>
        Dostęp tylko dla obsługi piekarni Chleba Smak
      </Typography>
    </Box>
  );
}

const linkSx = { color: COLORS.stone, fontSize: 14, '&:hover': { color: COLORS.gold } };

export const LoginPage = () => (
  <AuthShell title="Zaloguj się">
    {/* formularz react-admina: login, hasło, przycisk; komunikaty błędów po polsku (i18n) */}
    <Box
      sx={{
        // pola na całą szerokość okienka (react-admin ma stałe 300 px)
        // !important: react-admin ustawia 300 px stylem o tej samej sile, wstawianym później
        '& .RaLoginForm-content': { width: '100% !important', p: '0 !important' },
        '& .MuiButton-root': { mt: 1, py: 1.25 },
      }}
    >
      <LoginForm />
    </Box>
    <Link component={RouterLink} to="/nie-pamietam-hasla" underline="hover" sx={{ ...linkSx, display: 'inline-block', mt: 2 }}>
      Nie pamiętam hasła
    </Link>
  </AuthShell>
);

async function post(path: string, body: object) {
  const res = await fetch(`${apiUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (json as { message?: string | string[] }).message;
    throw new Error(Array.isArray(message) ? message[0] : (message ?? 'Nie udało się połączyć z serwerem'));
  }
  return json as Record<string, unknown>;
}

/** „Nie pamiętam hasła” – link do ustawienia nowego hasła na adres e-mail konta */
export const ForgotPasswordPage = () => {
  const [login, setLogin] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await post('/auth/forgot-password', { login });
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Nie pamiętam hasła">
      {sent ? (
        <Alert severity="success" variant="outlined">
          Jeśli to konto ma przypisany adres e-mail, wysłaliśmy na niego link do ustawienia nowego hasła (ważny 30 minut).
          Sprawdź też folder „Spam”. Nie ma wiadomości? Poproś administratora o nowe hasło.
        </Alert>
      ) : (
        <Box component="form" onSubmit={submit}>
          <Typography variant="body2" sx={{ color: COLORS.stone, mb: 2 }}>
            Podaj login albo adres e-mail konta – wyślemy link do ustawienia nowego hasła.
          </Typography>
          <TextField
            label="Login lub e-mail"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            fullWidth
            autoFocus
            required
            autoComplete="username"
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button type="submit" variant="contained" fullWidth disabled={busy || !login.trim()} sx={{ mt: 2, py: 1.25 }}>
            {busy ? 'Wysyłanie…' : 'Wyślij link'}
          </Button>
        </Box>
      )}
      <Link component={RouterLink} to="/login" underline="hover" sx={{ ...linkSx, display: 'inline-block', mt: 2 }}>
        ← Wróć do logowania
      </Link>
    </AuthShell>
  );
};

/** Nowe hasło z linku w e-mailu (#/nowe-haslo?token=…) */
export const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const weak = password.length > 0 && !isStrongPassword(password);
  const mismatch = repeat.length > 0 && repeat !== password;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const json = await post('/auth/reset-password', { token, password });
      setDone(String(json.login ?? ''));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Nowe hasło">
      {done !== null ? (
        <Alert severity="success" variant="outlined">
          Hasło zmienione{done ? ` dla konta „${done}”` : ''}. Wszystkie wcześniejsze logowania wygasły – zaloguj się nowym
          hasłem.
        </Alert>
      ) : !/^[a-f0-9]{64}$/.test(token) ? (
        <Alert severity="error" variant="outlined">
          Ten link jest niepełny. Otwórz go jeszcze raz z e-maila albo poproś o nowy.
        </Alert>
      ) : (
        <Box component="form" onSubmit={submit}>
          <TextField
            label="Nowe hasło"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            autoFocus
            required
            autoComplete="new-password"
            error={weak}
            helperText={<PasswordChecklist password={password} />}
            FormHelperTextProps={{ component: 'div' }}
          />
          <TextField
            label="Powtórz hasło"
            type="password"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            fullWidth
            required
            autoComplete="new-password"
            error={mismatch}
            helperText={mismatch ? 'Hasła się różnią' : ' '}
            sx={{ mt: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={busy || !isStrongPassword(password) || password !== repeat}
            sx={{ mt: 2, py: 1.25 }}
          >
            {busy ? 'Zapisywanie…' : 'Ustaw hasło'}
          </Button>
        </Box>
      )}
      <Link
        component={RouterLink}
        to={done !== null ? '/login' : '/nie-pamietam-hasla'}
        underline="hover"
        sx={{ ...linkSx, display: 'inline-block', mt: 2 }}
      >
        {done !== null ? 'Przejdź do logowania →' : 'Poproś o nowy link'}
      </Link>
    </AuthShell>
  );
};
