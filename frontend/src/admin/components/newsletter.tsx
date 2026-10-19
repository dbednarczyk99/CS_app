import {
  Datagrid,
  DateField,
  DeleteButton,
  downloadCSV,
  FunctionField,
  List,
  TextField,
  type Exporter,
} from 'react-admin';
import { Chip } from '@mui/material';

/* Zapisy do newslettera – tylko podgląd, eksport do CSV (np. do programu wysyłkowego) i usuwanie */

interface Subscriber {
  id: string;
  email: string;
  status: 'PENDING' | 'CONFIRMED' | 'UNSUBSCRIBED';
  consentAt: string;
  confirmedAt?: string | null;
  unsubscribedAt?: string | null;
}

const STATUS: Record<Subscriber['status'], { label: string; color: 'success' | 'default' | 'warning' }> = {
  CONFIRMED: { label: 'Potwierdzony', color: 'success' },
  PENDING: { label: 'Czeka na potwierdzenie', color: 'warning' },
  UNSUBSCRIBED: { label: 'Wypisany', color: 'default' },
};

const date = (iso?: string | null) => (iso ? new Date(iso).toLocaleString('pl-PL') : '');

// CSV z polskimi nagłówkami; średnik – polski Excel otwiera go bez importu
const exporter: Exporter<Subscriber> = (records) => {
  const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const header = ['E-mail', 'Status', 'Zgoda (data)', 'Potwierdzenie (data)', 'Wypisanie (data)'];
  const rows = records.map((r) =>
    [r.email, STATUS[r.status].label, date(r.consentAt), date(r.confirmedAt), date(r.unsubscribedAt)],
  );
  downloadCSV([header, ...rows].map((row) => row.map(cell).join(';')).join('\n'), 'newsletter');
};

export const NewsletterList = () => (
  <List
    title="Subskrybenci newslettera"
    exporter={exporter}
    sort={{ field: 'consentAt', order: 'DESC' }}
    empty={false}
  >
    <Datagrid bulkActionButtons={false} rowClick={false}>
      <TextField source="email" label="E-mail" />
      <FunctionField
        label="Status"
        render={(r: Subscriber) => <Chip size="small" label={STATUS[r.status].label} color={STATUS[r.status].color} />}
      />
      <DateField source="consentAt" label="Zgoda" showTime locales="pl-PL" />
      <DateField source="confirmedAt" label="Potwierdzenie" showTime locales="pl-PL" emptyText="—" />
      <DeleteButton mutationMode="pessimistic" confirmTitle="Usunąć zapis?" confirmContent="Adres zostanie trwale usunięty z listy." />
    </Datagrid>
  </List>
);
