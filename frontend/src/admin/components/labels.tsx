import { FormUnsavedChanges } from '../common/UnsavedChanges';
import { MobileList } from '../common/MobileList';
import { ScreenTabs } from '../common/ScreenTabs';
import { OFFER_TABS } from '../common/screen-tabs';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  FunctionField,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  DateInput,
  Toolbar,
  SaveButton,
  DeleteWithConfirmButton,
  useRecordContext,
  required,
  minLength,
  maxLength,
} from 'react-admin';
import { Alert, Box, Typography } from '@mui/material';

// system – etykieta stała nadawana przez stronę ("promo": trwająca promocja): bez usuwania i ręcznego przypisania
type LabelRecord = {
  id: string;
  name: string;
  color: string;
  system?: string | null;
  activeFrom?: string | null;
  activeTo?: string | null;
  _count?: { products: number };
};

const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw' }).format(new Date());
const dayMonth = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });

/** Widoczność etykiety z datami: zawsze / zaplanowana / widoczna do… / zakończona */
const visibility = (l: LabelRecord) => {
  if (l.system === 'promo') return { text: 'w czasie promocji', color: 'text.secondary' };
  const now = today();
  if (l.activeFrom && l.activeFrom > now) return { text: `od ${dayMonth(l.activeFrom)}`, color: 'info.main' };
  if (l.activeTo && l.activeTo < now) return { text: `zakończona ${dayMonth(l.activeTo)}`, color: 'text.disabled' };
  if (l.activeTo) return { text: `widoczna do ${dayMonth(l.activeTo)}`, color: 'success.main' };
  return { text: 'zawsze', color: 'text.secondary' };
};

const notBeforeStart = (value: string | null, all: LabelRecord) =>
  value && all.activeFrom && value < all.activeFrom ? 'Koniec nie może być przed początkiem' : undefined;

/** Okres widoczności (np. „Na święta”) – nie dla etykiety promocji, która ma daty z promocji produktu */
const DateInputs = () => {
  const record = useRecordContext<LabelRecord>();
  if (record?.system) return null;
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <DateInput source="activeFrom" label="Widoczna od" helperText="Puste – od razu" />
      <DateInput source="activeTo" label="Widoczna do (włącznie)" validate={notBeforeStart} helperText="Puste – bez końca" />
    </Box>
  );
};

// te same kolory co na stronie (web/src/lib/products.ts – BADGE_STYLE)
const LABEL_COLORS: Record<string, { name: string; bg: string; fg: string; border?: string }> = {
  gold: { name: 'Złota', bg: '#c9a36a', fg: '#141618' },
  cream: { name: 'Kremowa', bg: '#f4efe6', fg: '#141618' },
  dark: { name: 'Ciemna', bg: '#141618', fg: '#f4efe6', border: 'rgba(244,239,230,0.4)' },
  green: { name: 'Zielona', bg: '#556f40', fg: '#f4efe6' },
  red: { name: 'Czerwona', bg: '#b4473a', fg: '#f4efe6' },
};

/** Etykieta tak, jak wygląda na stronie (wersaliki, kolor z panelu) */
export const LabelChip = ({ name, color }: { name: string; color: string }) => {
  const c = LABEL_COLORS[color] ?? LABEL_COLORS.gold;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        px: 1.25,
        py: 0.4,
        bgcolor: c.bg,
        color: c.fg,
        border: `1px solid ${c.border ?? c.bg}`,
        fontSize: '0.68rem',
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {name}
    </Box>
  );
};

const colorChoices = Object.entries(LABEL_COLORS).map(([id, c]) => ({ id, name: c.name }));

const Info = () => {
  const record = useRecordContext<LabelRecord>();
  return (
    <Alert severity="info" sx={{ mb: 2, maxWidth: 640 }}>
      {record?.system === 'promo'
        ? 'Etykieta stała: strona nadaje ją sama produktom z trwającą promocją (włączaną w formularzu produktu). Możesz zmienić jej nazwę, kolor i kolejność – nie można jej usunąć ani przypisać ręcznie.'
        : 'Etykiety pojawiają się na zdjęciu produktu i jako filtry w ofercie (gdy mają przypisany co najmniej jeden produkt). Przypisujesz je w formularzu produktu. Etykietę promocji strona nadaje sama w czasie promocji, a „Teraz dostępne” – produktom sezonowym.'}
    </Alert>
  );
};

const LabelFields = () => (
  <>
    <Info />
    <TextInput
      source="name"
      label="Nazwa"
      validate={[required(), minLength(2), maxLength(30)]}
      helperText="Krótko, np. „Wegańskie”, „Bez glutenu”, „Na święta”, „Okazja”"
    />
    <SelectInput
      source="color"
      label="Kolor"
      choices={colorChoices}
      defaultValue="gold"
      validate={[required()]}
      optionText={(c: { id: string; name: string }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LabelChip name={c.name} color={c.id} />
        </Box>
      )}
    />
    <DateInputs />
    <NumberInput
      source="order"
      label="Kolejność"
      helperText="Mniejsza liczba = wyżej na zdjęciu produktu i wcześniej w filtrach"
    />
  </>
);

export const LabelList = () => (
  <>
  <ScreenTabs tabs={OFFER_TABS} />
  <List title="Etykiety produktów" sort={{ field: 'order', order: 'ASC' }} pagination={false}>
    <MobileList
      primaryText={(r) => <LabelChip name={r.name} color={r.color} />}
      secondaryText={(r) => (r.system === 'promo' ? 'stała – nadawana przy promocji' : '')}
      rowClick="edit"
    >
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <FunctionField
        label="Etykieta"
        sortBy="name"
        render={(r: LabelRecord) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LabelChip name={r.name} color={r.color} />
            {r.system === 'promo' && (
              <Typography variant="caption" color="text.secondary">
                stała – nadawana przy promocji
              </Typography>
            )}
          </Box>
        )}
      />
      <FunctionField
        label="Kolor"
        sortable={false}
        render={(r: LabelRecord) => LABEL_COLORS[r.color]?.name ?? r.color}
      />
      <FunctionField
        label="Widoczność"
        sortable={false}
        render={(r: LabelRecord) => {
          const v = visibility(r);
          return (
            <Typography variant="body2" sx={{ color: v.color }}>
              {v.text}
            </Typography>
          );
        }}
      />
      <NumberField source="_count.products" label="Produkty" sortable={false} />
      <NumberField source="order" label="Kolejność" />
      <TextField source="slug" label="Adres filtra" sortable={false} />
    </Datagrid>
    </MobileList>
  </List>
  </>
);

export const LabelCreate = () => (
  <Create title="Nowa etykieta" redirect="list">
    <SimpleForm>
      <FormUnsavedChanges />
      <LabelFields />
    </SimpleForm>
  </Create>
);

/** Usuwanie z potwierdzeniem – z informacją, z ilu produktów zniknie etykieta; etykiet stałych nie można usunąć */
const LabelEditToolbar = () => {
  const record = useRecordContext<LabelRecord>();
  const count = record?._count?.products ?? 0;
  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton />
      {!record?.system && (
        <DeleteWithConfirmButton
          confirmTitle={`Usunąć etykietę „${record?.name ?? ''}”?`}
          confirmContent={
            count > 0
              ? `Etykieta zniknie z ${count} ${count === 1 ? 'produktu' : 'produktów'}. Same produkty zostaną.`
              : 'Etykieta nie jest przypisana do żadnego produktu.'
          }
        />
      )}
    </Toolbar>
  );
};

export const LabelEdit = () => (
  <Edit title="Etykieta" mutationMode="pessimistic" redirect="list">
    <SimpleForm toolbar={<LabelEditToolbar />}>
      <FormUnsavedChanges />
      <LabelFields />
    </SimpleForm>
  </Edit>
);
