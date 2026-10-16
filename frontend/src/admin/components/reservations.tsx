import {
  List,
  Datagrid,
  TextField,
  FunctionField,
  Show,
  SimpleShowLayout,
  SelectInput,
  SearchInput,
  DateInput,
  useRecordContext,
  TopToolbar,
  ListButton,
  Button,
  Confirm,
  useNotify,
  useRefresh,
  type RaRecord,
} from 'react-admin';
import {
  STATUS,
  formatDay,
  formatPhone,
  money,
  statusChoices,
  type ReservationStatus,
} from '../common/reservation-utils';
import { useState } from 'react';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { Box, Chip, Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

export interface Reservation extends RaRecord {
  number: string;
  status: ReservationStatus;
  pickupType: 'STORE' | 'VAN';
  pickupLabel: string;
  pickupDate: string;
  pickupTime: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string | null;
  total: string;
  createdAt: string;
  anonymizedAt: string | null;
  items: { id: string; productName: string; unitPrice: string; quantity: number }[];
}

export const StatusChip = ({ status }: { status: ReservationStatus }) => (
  <Chip size="small" label={STATUS[status].label} color={STATUS[status].color} variant={status === 'CANCELLED' ? 'outlined' : 'filled'} />
);

const filters = [
  <SearchInput key="q" source="q" alwaysOn placeholder="Numer, nazwisko, telefon, e-mail" />,
  <DateInput key="date" source="pickupDate" label="Dzień odbioru" alwaysOn />,
  <SelectInput key="status" source="status" label="Status" choices={statusChoices} alwaysOn />,
  <SelectInput
    key="type"
    source="pickupType"
    label="Miejsce"
    choices={[
      { id: 'STORE', name: 'Piekarnia' },
      { id: 'VAN', name: 'Chlebowóz' },
    ]}
  />,
];

export const ReservationList = () => (
  <List filters={filters} title="Rezerwacje" pagination={false} perPage={1000} exporter={false}>
    <Datagrid
      rowClick="show"
      bulkActionButtons={false}
      rowSx={(record) => (record.status === 'CANCELLED' ? { opacity: 0.55 } : {})}
    >
      <TextField source="number" label="Numer" sx={{ whiteSpace: 'nowrap', fontWeight: 600 }} />
      <FunctionField<Reservation>
        label="Odbiór"
        render={(r) => (
          <>
            <Typography variant="body2" fontWeight={600}>
              {formatDay(r.pickupDate)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {r.pickupTime}
            </Typography>
          </>
        )}
      />
      <FunctionField<Reservation>
        label="Miejsce"
        render={(r) => `${r.pickupType === 'VAN' ? '🚚 ' : ''}${r.pickupLabel.split(/,\s*(?=\d{2}-\d{3})/)[0]}`}
      />
      <FunctionField<Reservation>
        label="Klient"
        render={(r) => (
          <>
            <Typography variant="body2">{r.customerName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatPhone(r.customerPhone)}
            </Typography>
          </>
        )}
      />
      <FunctionField<Reservation>
        label="Produkty"
        render={(r) => r.items.map((i) => `${i.productName} ×${i.quantity}`).join(', ')}
        sx={{ maxWidth: 280, display: 'block' }}
      />
      <FunctionField<Reservation> label="Kwota" render={(r) => money(r.total)} textAlign="right" />
      <FunctionField<Reservation> label="Status" render={(r) => <StatusChip status={r.status} />} />
    </Datagrid>
  </List>
);

const ReservationDetails = () => {
  const r = useRecordContext<Reservation>();
  if (!r) return null;
  return (
    <Box sx={{ width: '100%', maxWidth: 720 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">{r.number}</Typography>
        <StatusChip status={r.status} />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Odbiór
          </Typography>
          <Typography fontWeight={600}>
            {formatDay(r.pickupDate)}, {r.pickupTime}
          </Typography>
          <Typography variant="body2">
            {r.pickupType === 'VAN' ? 'Chlebowóz' : 'Piekarnia'}: {r.pickupLabel}
          </Typography>
        </Box>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Klient
          </Typography>
          <Typography fontWeight={600}>{r.customerName}</Typography>
          <Typography variant="body2">
            <a href={`tel:${r.customerPhone}`}>{formatPhone(r.customerPhone)}</a> ·{' '}
            <a href={`mailto:${r.customerEmail}`}>{r.customerEmail}</a>
          </Typography>
        </Box>
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Produkt</TableCell>
            <TableCell align="center">Ilość</TableCell>
            <TableCell align="right">Cena</TableCell>
            <TableCell align="right">Razem</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {r.items.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.productName}</TableCell>
              <TableCell align="center">{i.quantity}</TableCell>
              <TableCell align="right">{money(i.unitPrice)}</TableCell>
              <TableCell align="right">{money(Number(i.unitPrice) * i.quantity)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3}>
              <strong>Do zapłaty przy odbiorze</strong>
            </TableCell>
            <TableCell align="right">
              <strong>{money(r.total)}</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {r.notes && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="overline" color="text.secondary">
            Uwagi klienta
          </Typography>
          <Typography>{r.notes}</Typography>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Złożona: {new Date(r.createdAt).toLocaleString('pl-PL')}
      </Typography>
      <Divider sx={{ my: 3 }} />
    </Box>
  );
};

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/** Usunięcie danych klienta na jego żądanie (RODO, art. 17) – produkty i daty zostają do statystyk */
const AnonymizeButton = () => {
  const record = useRecordContext<Reservation>();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  if (!record || record.anonymizedAt) return null;

  const run = async () => {
    setBusy(true);
    try {
      const res = await fetch(`${apiUrl}/reservations/${record.id}/anonymize`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
      });
      if (!res.ok) throw new Error('Nie udało się usunąć danych');
      notify('Dane klienta zostały usunięte', { type: 'success' });
      refresh();
    } catch (e) {
      notify((e as Error).message, { type: 'error' });
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button label="Usuń dane klienta" onClick={() => setOpen(true)} color="error">
        <PersonOffIcon />
      </Button>
      <Confirm
        isOpen={open}
        loading={busy}
        title="Usunąć dane klienta?"
        content="Imię, telefon, e-mail i uwagi zostaną trwale usunięte. Produkty, termin i punkt odbioru zostaną (bez danych osobowych). Tej operacji nie można cofnąć."
        confirm="Usuń dane"
        onConfirm={run}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const ShowActions = () => (
  <TopToolbar>
    <AnonymizeButton />
    <ListButton label="Lista rezerwacji" />
  </TopToolbar>
);

/** Podgląd rezerwacji – tylko do informacji; status zmienia wyłącznie klient (anulowanie linkiem z e-maila) */
export const ReservationShow = () => (
  <Show title="Rezerwacja" actions={<ShowActions />}>
    <SimpleShowLayout>
      <ReservationDetails />
    </SimpleShowLayout>
  </Show>
);
