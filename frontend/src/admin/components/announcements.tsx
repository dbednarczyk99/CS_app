import {
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  DateTimeInput,
  Edit,
  FunctionField,
  List,
  NumberField,
  NumberInput,
  SimpleForm,
  TextField,
  TextInput,
  maxLength,
  required,
  useGetList,
} from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';
import { Box, Chip, MenuItem, TextField as MuiTextField, Typography } from '@mui/material';

/* Baner informacyjny pod nawigacją strony – komunikaty z linkiem i okresem wyświetlania */

interface AnnouncementRecord {
  id: string;
  message: string;
  linkUrl?: string | null;
  linkLabel?: string | null;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}

function status(a: AnnouncementRecord) {
  const now = Date.now();
  if (!a.isActive) return { label: 'Wyłączony', color: 'default' as const };
  if (a.startsAt && new Date(a.startsAt).getTime() > now) return { label: 'Zaplanowany', color: 'info' as const };
  if (a.endsAt && new Date(a.endsAt).getTime() <= now) return { label: 'Zakończony', color: 'default' as const };
  return { label: 'Widoczny na stronie', color: 'success' as const };
}

export const AnnouncementList = () => (
  <List title="Baner informacyjny" sort={{ field: 'order', order: 'ASC' }}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="message" label="Komunikat" />
      <FunctionField
        label="Status"
        render={(a: AnnouncementRecord) => {
          const s = status(a);
          return <Chip size="small" label={s.label} color={s.color} />;
        }}
      />
      <DateField source="startsAt" label="Od" showTime emptyText="od razu" />
      <DateField source="endsAt" label="Do" showTime emptyText="bezterminowo" />
      <NumberField source="order" label="Kolejność" />
    </Datagrid>
  </List>
);

const validateLink = (value?: string | null) =>
  value && !/^(\/|https?:\/\/)\S*$/.test(value)
    ? 'Link musi zaczynać się od „/” (strona piekarni) albo „https://”'
    : undefined;

const validateEnd = (value: string | null, all: AnnouncementRecord) =>
  value && all.startsAt && new Date(value) <= new Date(all.startsAt)
    ? 'Musi być później niż data rozpoczęcia'
    : undefined;

/** Podgląd paska w kolorach strony */
const Preview = () => {
  const [message, linkUrl, linkLabel] = useWatch({ name: ['message', 'linkUrl', 'linkLabel'] }) as string[];
  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Podgląd na stronie
      </Typography>
      <Box
        sx={{
          bgcolor: '#c9a36a',
          color: '#141618',
          px: 3,
          minHeight: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          fontSize: 14,
        }}
      >
        <span>{message || 'Treść komunikatu…'}</span>
        {linkUrl && (
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              border: '1px solid #141618',
              padding: '4px 12px',
              whiteSpace: 'nowrap',
            }}
          >
            {linkLabel || 'Dowiedz się więcej'} →
          </span>
        )}
        <span style={{ marginLeft: 'auto', opacity: 0.7 }}>✕</span>
      </Box>
    </Box>
  );
};

/** Wybór wpisu z bloga – wpisuje link do artykułu */
const ArticlePicker = () => {
  const { setValue } = useFormContext();
  const linkUrl = useWatch({ name: 'linkUrl' }) as string | undefined;
  const { data = [] } = useGetList<{ id: string; title: string }>('blog', {
    pagination: { page: 1, perPage: 100 },
  });
  const selected = data.find((a) => linkUrl === `/aktualnosci/${a.id}`)?.id ?? '';

  return (
    <MuiTextField
      select
      label="Powiąż z wpisem na blogu (opcjonalnie)"
      value={selected}
      onChange={(e) => {
        const id = e.target.value;
        setValue('linkUrl', id ? `/aktualnosci/${id}` : '', { shouldDirty: true, shouldValidate: true });
      }}
      helperText="Wybór wpisu sam uzupełni link poniżej"
      fullWidth
      variant="filled"
      size="small"
      sx={{ mb: 2 }}
    >
      <MenuItem value="">
        <em>— bez wpisu —</em>
      </MenuItem>
      {data.map((article) => (
        <MenuItem key={article.id} value={article.id}>
          {article.title}
        </MenuItem>
      ))}
    </MuiTextField>
  );
};

const AnnouncementForm = () => (
  <SimpleForm>
    <Preview />
    <TextInput
      source="message"
      label="Treść komunikatu"
      multiline
      fullWidth
      validate={[required(), maxLength(160, 'Najwyżej 160 znaków')]}
      helperText="Krótko – najwyżej 160 znaków (na telefonie pasek ma do 3 linii, ok. 140 znaków)"
    />
    <BooleanInput source="isActive" label="Włączony" defaultValue={true} />

    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
      Przycisk z linkiem
    </Typography>
    <ArticlePicker />
    <TextInput
      source="linkUrl"
      label="Link"
      fullWidth
      validate={validateLink}
      helperText="Strona piekarni, np. /aktualnosci/… lub /chlebowoz, albo pełny adres https://…; puste = bez przycisku"
    />
    <TextInput
      source="linkLabel"
      label="Napis na przycisku"
      validate={maxLength(40, 'Najwyżej 40 znaków')}
      helperText="Puste = „Dowiedz się więcej”"
    />

    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
      Okres wyświetlania
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <DateTimeInput source="startsAt" label="Od" helperText="Puste = od razu" />
      <DateTimeInput source="endsAt" label="Do" validate={validateEnd} helperText="Puste = bezterminowo; po tej dacie baner zniknie sam" />
    </Box>
    <NumberInput
      source="order"
      label="Kolejność"
      defaultValue={0}
      helperText="Gdy włączonych jest kilka komunikatów, zmieniają się co kilka sekund – mniejsza liczba = wcześniej"
    />
  </SimpleForm>
);

export const AnnouncementCreate = () => (
  <Create title="Nowy komunikat" redirect="list">
    <AnnouncementForm />
  </Create>
);

export const AnnouncementEdit = () => (
  <Edit title="Edycja komunikatu" redirect="list">
    <AnnouncementForm />
  </Edit>
);
