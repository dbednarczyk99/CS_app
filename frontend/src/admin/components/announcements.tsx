import { MobileList } from '../common/MobileList';
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
  TextInput,
  maxLength,
  required,
  useGetList,
  useRecordContext,
  Toolbar,
  SaveButton,
  DeleteButton,
} from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';
import { Alert, Box, Chip, MenuItem, TextField as MuiTextField, Typography } from '@mui/material';

/* Baner informacyjny pod nawigacją strony – komunikaty z linkiem i okresem wyświetlania */

interface AnnouncementRecord {
  id: string;
  message: string;
  linkUrl?: string | null;
  linkLabel?: string | null;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  /** komunikat stały („promo”): pokazywany automatycznie, gdy trwa jakakolwiek promocja – bez usuwania */
  system?: string | null;
}

function status(a: AnnouncementRecord) {
  const now = Date.now();
  if (!a.isActive) return { label: 'Wyłączony', color: 'default' as const };
  if (a.system === 'promo') return { label: 'Automatycznie w czasie promocji', color: 'info' as const };
  if (a.startsAt && new Date(a.startsAt).getTime() > now) return { label: 'Zaplanowany', color: 'info' as const };
  if (a.endsAt && new Date(a.endsAt).getTime() <= now) return { label: 'Zakończony', color: 'default' as const };
  return { label: 'Widoczny na stronie', color: 'success' as const };
}

export const AnnouncementList = () => (
  <List title="Baner informacyjny" sort={{ field: 'order', order: 'ASC' }}>
    <MobileList
      primaryText={(a) => a.message}
      secondaryText={(a) => status(a).label}
      rowSx={(a) => (status(a).color === 'default' ? { opacity: 0.6 } : {})}
      rowClick="edit"
    >
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <FunctionField
        label="Komunikat"
        render={(a: AnnouncementRecord) => (
          <>
            {a.message}
            {a.system === 'promo' && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                stały – baner promocji (pokazuje się sam, gdy trwa jakakolwiek promocja)
              </Typography>
            )}
          </>
        )}
      />
      <FunctionField
        label="Status"
        render={(a: AnnouncementRecord) => {
          const s = status(a);
          return <Chip size="small" label={s.label} color={s.color} />;
        }}
      />
      <FunctionField
        label="Od"
        render={(a: AnnouncementRecord) =>
          a.system ? 'w czasie promocji' : <DateField source="startsAt" showTime locales="pl-PL" emptyText="od razu" />
        }
      />
      <FunctionField
        label="Do"
        render={(a: AnnouncementRecord) =>
          a.system ? '' : <DateField source="endsAt" showTime locales="pl-PL" emptyText="bezterminowo" />
        }
      />
      <NumberField source="order" label="Kolejność" />
    </Datagrid>
    </MobileList>
  </List>
);

const validateLink = (value?: string | null) =>
  value && !/^(\/\S*|https?:\/\/\S+|#newsletter)$/.test(value)
    ? 'Link musi zaczynać się od „/” (strona piekarni) albo „https://”, ewentualnie „#newsletter”'
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

const NEWSLETTER_LINK = '#newsletter';
const PROMO_LINK = '/oferta?etykiety=promocje';

/** Szybki wybór celu przycisku: okienko newslettera albo wpis z bloga – wpisuje link poniżej */
const ArticlePicker = () => {
  const { setValue } = useFormContext();
  const linkUrl = useWatch({ name: 'linkUrl' }) as string | undefined;
  const { data: articles = [] } = useGetList<{ id: string; title: string; slug?: string | null; isPublished?: boolean }>('blog', {
    pagination: { page: 1, perPage: 100 },
  });
  // tylko wpisy widoczne na stronie (nieopublikowany wpis = link do pustej strony)
  const data = articles.filter((a) => a.isPublished !== false);
  const selected =
    linkUrl === NEWSLETTER_LINK || linkUrl === PROMO_LINK
      ? linkUrl
      : (data.find((a) => linkUrl === `/aktualnosci/${a.id}` || (a.slug && linkUrl === `/aktualnosci/${a.slug}`))?.id ?? '');

  return (
    <MuiTextField
      select
      label="Przycisk prowadzi do… (opcjonalnie)"
      value={selected}
      onChange={(e) => {
        const id = e.target.value;
        // czytelny adres wpisu (slug); stare linki z id dalej działają – strona przekierowuje
        const article = data.find((a) => a.id === id);
        const link =
          id === NEWSLETTER_LINK || id === PROMO_LINK ? id : id ? `/aktualnosci/${article?.slug ?? id}` : '';
        setValue('linkUrl', link, { shouldDirty: true, shouldValidate: true });
      }}
      helperText="Wybór sam uzupełni link poniżej"
      fullWidth
      variant="filled"
      size="small"
      sx={{ mb: 2 }}
    >
      <MenuItem value="">
        <em>— wpiszę link ręcznie —</em>
      </MenuItem>
      <MenuItem value={NEWSLETTER_LINK}>Okienko zapisu do newslettera</MenuItem>
      <MenuItem value={PROMO_LINK}>Oferta – produkty w promocji</MenuItem>
      {data.map((article) => (
        <MenuItem key={article.id} value={article.id}>
          {article.title}
        </MenuItem>
      ))}
    </MuiTextField>
  );
};

/** Komunikat stały nie ma przycisku „Usuń” (pokazuje się sam w czasie promocji; można go wyłączyć) */
const FormToolbar = () => {
  const record = useRecordContext<AnnouncementRecord>();
  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton />
      {record && !record.system && <DeleteButton />}
    </Toolbar>
  );
};

const PeriodInputs = () => {
  const record = useRecordContext<AnnouncementRecord>();
  if (record?.system === 'promo') return null;
  return (
    <>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Okres wyświetlania
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <DateTimeInput source="startsAt" label="Od" helperText="Puste = od razu" />
        <DateTimeInput source="endsAt" label="Do" validate={validateEnd} helperText="Puste = bezterminowo; po tej dacie baner zniknie sam" />
      </Box>
    </>
  );
};

const SystemInfo = () => {
  const record = useRecordContext<AnnouncementRecord>();
  if (record?.system !== 'promo') return null;
  return (
    <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
      Baner promocji pokazuje się na stronie sam, gdy trwa jakakolwiek promocja (bez nazw produktów – zbiorczo),
      i znika po zakończeniu ostatniej. Możesz zmienić treść i przycisk albo go wyłączyć – nie można go usunąć.
    </Alert>
  );
};

const AnnouncementForm = () => (
  <SimpleForm toolbar={<FormToolbar />}>
    <SystemInfo />
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
      helperText="Strona piekarni, np. /aktualnosci/… lub /chlebowoz, pełny adres https://… albo #newsletter (okienko zapisu); puste = bez przycisku"
    />
    <TextInput
      source="linkLabel"
      label="Napis na przycisku"
      validate={maxLength(40, 'Najwyżej 40 znaków')}
      helperText="Puste = „Dowiedz się więcej”"
    />

    <PeriodInputs />
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
