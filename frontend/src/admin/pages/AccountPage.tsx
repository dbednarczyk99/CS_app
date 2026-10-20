import { useState } from 'react';
import { Title, useGetIdentity, useNotify, usePermissions } from 'react-admin';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/** Moje konto: kto jest zalogowany i zmiana własnego hasła */
export default function AccountPage() {
  const { identity } = useGetIdentity();
  const { permissions } = usePermissions();
  const notify = useNotify();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const mismatch = repeat.length > 0 && next !== repeat;
  const tooShort = next.length > 0 && next.length < 10;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!current || next.length < 10 || next !== repeat) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/auth/me/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
        },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        const message = Array.isArray(body?.message) ? body.message.join(' ') : body?.message;
        throw new Error(message ?? 'Nie udało się zmienić hasła');
      }
      // nowy token dla tej sesji – inne urządzenia zostają wylogowane
      localStorage.setItem('token', body.access_token);
      setCurrent('');
      setNext('');
      setRepeat('');
      notify('Hasło zostało zmienione', { type: 'success' });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', py: { xs: 2, md: 4 } }}>
      <Title title="Moje konto" />
      <Typography variant="overline" color="primary">
        Moje konto
      </Typography>
      <Typography variant="h4" sx={{ mt: 0.5 }}>
        {identity?.fullName ?? '…'}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {permissions === 'ADMIN'
          ? 'Administrator – pełny dostęp do panelu'
          : 'Marketing: produkty, piekarnie, chlebowóz, treści strony, aktualności i newsletter, subskrybenci, baner i media społecznościowe'}
      </Typography>

      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardContent component="form" onSubmit={submit} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Zmiana hasła
          </Typography>
          <Stack spacing={1}>
            <TextField
              type="password"
              label="Obecne hasło"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
              required
            />
            <TextField
              type="password"
              label="Nowe hasło"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
              error={tooShort}
              helperText="Co najmniej 10 znaków – najlepiej kilka słów, łatwych do zapamiętania"
              required
            />
            <TextField
              type="password"
              label="Powtórz nowe hasło"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              autoComplete="new-password"
              error={mismatch}
              helperText={mismatch ? 'Hasła się różnią' : ' '}
              required
            />
          </Stack>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={busy || !current || next.length < 10 || next !== repeat}
          >
            {busy ? 'Zapisywanie…' : 'Zmień hasło'}
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Po zmianie hasła zostaniesz wylogowany(-a) na innych urządzeniach.{' '}
            {permissions === 'ADMIN'
              ? 'Gdy ktoś zapomni hasła, ustawisz mu nowe w zakładce „Konta”.'
              : 'Jeśli zapomnisz hasła, poproś administratora o ustawienie nowego.'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
