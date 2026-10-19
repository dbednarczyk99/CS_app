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
  Toolbar,
  SaveButton,
  DeleteWithConfirmButton,
  useRecordContext,
  required,
  minLength,
  maxLength,
} from 'react-admin';
import { Alert, Box } from '@mui/material';

type LabelRecord = { id: string; name: string; color: string; _count?: { products: number } };

// te same kolory co na stronie (web/src/lib/products.ts – BADGE_STYLE)
const LABEL_COLORS: Record<string, { name: string; bg: string; fg: string; border?: string }> = {
  gold: { name: 'Złota', bg: '#c9a36a', fg: '#141618' },
  cream: { name: 'Kremowa', bg: '#f4efe6', fg: '#141618' },
  dark: { name: 'Ciemna', bg: '#141618', fg: '#f4efe6', border: 'rgba(244,239,230,0.4)' },
  green: { name: 'Zielona', bg: '#556f40', fg: '#f4efe6' },
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

const Info = () => (
  <Alert severity="info" sx={{ mb: 2, maxWidth: 640 }}>
    Etykiety pojawiają się na zdjęciu produktu i jako filtry w ofercie (gdy mają przypisany co najmniej jeden
    produkt). Przypisujesz je w formularzu produktu. Etykiety „Promocja” i „Teraz dostępne” strona dodaje sama –
    przy promocji i produktach sezonowych.
  </Alert>
);

const LabelFields = () => (
  <>
    <Info />
    <TextInput
      source="name"
      label="Nazwa"
      validate={[required(), minLength(2), maxLength(30)]}
      helperText="Krótko, np. „Wegańskie”, „Bez glutenu”, „Na święta”"
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
    <NumberInput
      source="order"
      label="Kolejność"
      helperText="Mniejsza liczba = wyżej na zdjęciu produktu i wcześniej w filtrach"
    />
  </>
);

export const LabelList = () => (
  <List title="Etykiety produktów" sort={{ field: 'order', order: 'ASC' }} pagination={false}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <FunctionField
        label="Etykieta"
        sortBy="name"
        render={(r: LabelRecord) => <LabelChip name={r.name} color={r.color} />}
      />
      <FunctionField
        label="Kolor"
        sortable={false}
        render={(r: LabelRecord) => LABEL_COLORS[r.color]?.name ?? r.color}
      />
      <NumberField source="_count.products" label="Produkty" sortable={false} />
      <NumberField source="order" label="Kolejność" />
      <TextField source="slug" label="Adres filtra" sortable={false} />
    </Datagrid>
  </List>
);

export const LabelCreate = () => (
  <Create title="Nowa etykieta" redirect="list">
    <SimpleForm>
      <LabelFields />
    </SimpleForm>
  </Create>
);

/** Usuwanie z potwierdzeniem – z informacją, z ilu produktów zniknie etykieta */
const LabelEditToolbar = () => {
  const record = useRecordContext<LabelRecord>();
  const count = record?._count?.products ?? 0;
  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton />
      <DeleteWithConfirmButton
        confirmTitle={`Usunąć etykietę „${record?.name ?? ''}”?`}
        confirmContent={
          count > 0
            ? `Etykieta zniknie z ${count} ${count === 1 ? 'produktu' : 'produktów'}. Same produkty zostaną.`
            : 'Etykieta nie jest przypisana do żadnego produktu.'
        }
      />
    </Toolbar>
  );
};

export const LabelEdit = () => (
  <Edit title="Etykieta" mutationMode="pessimistic" redirect="list">
    <SimpleForm toolbar={<LabelEditToolbar />}>
      <LabelFields />
    </SimpleForm>
  </Edit>
);
