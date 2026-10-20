import { useEffect, useState } from 'react';
import { Title, useNotify } from 'react-admin';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import MailIcon from '@mui/icons-material/Mail';
import { formatDay, formatPhone } from '../common/reservation-utils';
import { StatusChip, type Reservation } from '../components/reservations';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Summary {
  date: string;
  reservationsCount: number;
  totals: { name: string; quantity: number }[];
  points: {
    key: string;
    pickupType: 'STORE' | 'VAN';
    label: string;
    products: { name: string; quantity: number }[];
    reservations: Reservation[];
  }[];
}

// jutro w czasie polskim
const tomorrow = () => {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw' }).format(new Date());
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

/** Zestawienie „do przygotowania”: co upiec/odłożyć na dany dzień, z podziałem na punkty odbioru */
export default function PreparationPage() {
  const [date, setDate] = useState(tomorrow);
  // wynik dla konkretnego dnia – „ładowanie” = brak wyniku dla bieżącej daty
  const [result, setResult] = useState<{ date: string; summary?: Summary; error?: string } | null>(null);
  const [sending, setSending] = useState(false);
  const notify = useNotify();

  // ten sam mail, który (po włączeniu w Rezerwacje → Zasady rezerwacji) wychodzi automatycznie codziennie
  const sendEmail = async () => {
    setSending(true);
    try {
      const res = await fetch(`${apiUrl}/reservations/summary/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
        },
        body: JSON.stringify({ date }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? 'Nie udało się wysłać');
      notify(`Wysłano zestawienie na ${body.sentTo}`, { type: 'success' });
    } catch (e) {
      notify((e as Error).message, { type: 'error' });
    } finally {
      setSending(false);
    }
  };
  const loading = result?.date !== date;
  const summary = result?.date === date ? result.summary : undefined;
  const error = result?.date === date ? result.error : undefined;

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiUrl}/reservations/summary?date=${date}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 401 ? 'Zaloguj się ponownie' : 'Nie udało się pobrać zestawienia');
        return res.json() as Promise<Summary>;
      })
      .then((data) => !cancelled && setResult({ date, summary: data }))
      .catch((e: Error) => !cancelled && setResult({ date, error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [date]);

  return (
    <Box sx={{ py: 2 }}>
      <Title title="Do przygotowania" />
      {/* flexWrap + useFlexGap: na telefonie przyciski zawijają się pod pole daty zamiast na siebie nachodzić */}
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 3, '@media print': { display: 'none' } }}>
        <TextField
          type="date"
          label="Dzień odbioru"
          value={date}
          onChange={(e) => e.target.value && setDate(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
          fullWidth={false}
          sx={{ width: 200 }}
        />
        <Button variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()} sx={{ whiteSpace: 'nowrap' }}>
          Drukuj
        </Button>
        <Button
          variant="outlined"
          startIcon={<MailIcon />}
          onClick={sendEmail}
          disabled={sending}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Wyślij e-mailem
        </Button>
        {loading && <CircularProgress size={20} />}
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {summary && (
        <>
          <Typography variant="h5" sx={{ mb: 0.5, '&::first-letter': { textTransform: 'uppercase' } }}>
            {formatDay(summary.date)}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Rezerwacji: {summary.reservationsCount} (bez anulowanych)
          </Typography>

          {summary.reservationsCount === 0 ? (
            <Alert severity="info">Brak rezerwacji na ten dzień.</Alert>
          ) : (
            <Stack spacing={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Razem – wszystkie punkty
                  </Typography>
                  <ProductsTable products={summary.totals} />
                </CardContent>
              </Card>

              {summary.points.map((point) => (
                <Card key={point.key} variant="outlined" sx={{ breakInside: 'avoid' }}>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      {point.pickupType === 'VAN' ? 'Chlebowóz' : 'Piekarnia'}
                    </Typography>
                    <Typography variant="h6">{point.label}</Typography>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 2 }}>
                      <Box sx={{ minWidth: 260 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Do przygotowania
                        </Typography>
                        <ProductsTable products={point.products} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Rezerwacje ({point.reservations.length})
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Godz.</TableCell>
                              <TableCell>Numer</TableCell>
                              <TableCell>Klient</TableCell>
                              <TableCell>Produkty</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {point.reservations.map((r) => (
                              <TableRow key={r.id}>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>{r.pickupTime}</TableCell>
                                <TableCell>{r.number}</TableCell>
                                <TableCell>
                                  {r.customerName}
                                  <br />
                                  <Typography variant="caption" color="text.secondary">
                                    {formatPhone(r.customerPhone)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {r.items.map((i) => `${i.productName} ×${i.quantity}`).join(', ')}
                                  {r.notes && (
                                    <Typography variant="caption" display="block" color="warning.main">
                                      Uwagi: {r.notes}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <StatusChip status={r.status} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}

function ProductsTable({ products }: { products: { name: string; quantity: number }[] }) {
  return (
    <Table size="small">
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.name}>
            <TableCell>{p.name}</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, width: 70 }}>
              × {p.quantity}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
