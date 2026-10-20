import { ScreenTabs } from '../common/ScreenTabs';
import { HOME_TABS } from '../common/screen-tabs';
import {
  BooleanInput,
  Create,
  Datagrid,
  DateTimeInput,
  DeleteWithConfirmButton,
  Edit,
  FunctionField,
  List,
  NumberField,
  NumberInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  maxLength,
  required,
  useInput,
  useListContext,
  useNotify,
  useRecordContext,
  ValidationError,
} from 'react-admin';
import { useState } from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { Alert, Box, Button, Chip, Stack, Typography } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { apiUrl, httpClient } from '../../dataProvider';
import { ImageUploadField } from '../common/ImageUploadField';
import { VersionHistory } from './VersionHistory';
import type { Revision } from './revisions';

/** najwyżej tyle włączonych slajdów naraz (to samo sprawdza serwer) */
const MAX_ACTIVE = 5;
/** pola slajdu wczytywane z historii / stanu domyślnego */
const SLIDE_FIELDS = [
  'name',
  'eyebrow',
  'titleLine1',
  'titleLine2',
  'text',
  'cta1Label',
  'cta1Href',
  'cta2Label',
  'cta2Href',
  'imageUrl',
  'imageAlt',
  'imagePosition',
  'mobileImageUrl',
  'mobileImagePosition',
];

/* Karuzela na górze strony głównej – slajdy z tekstem, przyciskami i zdjęciem (osobny kadr na telefon) */

type Kind = 'CUSTOM' | 'VAN' | 'BAKERIES' | 'SEASONAL';

interface SlideRecord {
  id: string;
  kind: Kind;
  defaultKey?: string | null;
  name: string;
  titleLine1: string;
  titleLine2: string;
  imageUrl: string;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}

const KIND: Record<Kind, { label: string; info: string }> = {
  CUSTOM: { label: 'Własny', info: '' },
  VAN: {
    label: 'Chlebowóz',
    info: 'Slajd automatyczny: pokazuje najbliższy przystanek chlebowozu (z zakładki „Chlebowóz”). Bez przystanków na trasie nie wyświetla się.',
  },
  BAKERIES: {
    label: 'Piekarnie',
    info: 'Slajd automatyczny: w tytule i opisie „{piekarnie}” zamienia się na liczbę piekarni, np. „4 piekarnie”.',
  },
  SEASONAL: {
    label: 'Sezonowe',
    info: 'Slajd automatyczny: wyświetla się tylko wtedy, gdy w ofercie jest dostępny teraz jakiś produkt sezonowy (poza sezonem znika sam).',
  },
};

/** Slajd liczy się do limitu: włączony i jeszcze się nie zakończył */
const countsToLimit = (s: SlideRecord) => s.isActive && (!s.endsAt || new Date(s.endsAt).getTime() > Date.now());

/** Licznik włączonych slajdów nad listą */
const ActiveCount = () => {
  const { data = [] } = useListContext<SlideRecord>();
  const active = data.filter(countsToLimit).length;
  return (
    <Typography variant="body2" sx={{ px: 2, pt: 1.5, color: active >= MAX_ACTIVE ? 'warning.main' : 'text.secondary' }}>
      Włączone slajdy: <strong>{active}</strong> / {MAX_ACTIVE}
      {active >= MAX_ACTIVE && ' – aby włączyć kolejny, najpierw wyłącz inny.'}
    </Typography>
  );
};

function status(s: SlideRecord) {
  const now = Date.now();
  if (!s.isActive) return { label: 'Wyłączony', color: 'default' as const };
  if (s.startsAt && new Date(s.startsAt).getTime() > now) return { label: 'Zaplanowany', color: 'info' as const };
  if (s.endsAt && new Date(s.endsAt).getTime() <= now) return { label: 'Zakończony', color: 'default' as const };
  return { label: 'Widoczny', color: 'success' as const };
}

export const HeroSlideList = () => (
  <>
  <ScreenTabs tabs={HOME_TABS} />
  <List title="Karuzela na stronie głównej" sort={{ field: 'order', order: 'ASC' }} pagination={false}>
    <Box sx={{ px: 2, pt: 2 }}>
      <Alert severity="info" variant="outlined">
        Slajdy zmieniają się co 7 sekund, w kolejności od najmniejszej liczby w kolumnie „Kolejność”. Na karuzeli może być
        najwyżej {MAX_ACTIVE} włączonych slajdów – pozostałe możesz trzymać w zapasie jako wyłączone (np. świąteczny na
        grudzień). Slajdy automatyczne (Chlebowóz, Piekarnie, Sezonowe) pokazują dane z panelu – można je edytować i
        wyłączać, ale nie usuwać.
      </Alert>
    </Box>
    <ActiveCount />
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <NumberField source="order" label="Kolejność" />
      <FunctionField
        label="Slajd"
        render={(s: SlideRecord) => (
          <>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {s.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {[s.titleLine1, s.titleLine2].filter(Boolean).join(' ')}
            </Typography>
          </>
        )}
      />
      <FunctionField
        label="Rodzaj"
        render={(s: SlideRecord) => (
          <Chip size="small" variant="outlined" label={KIND[s.kind].label} />
        )}
      />
      <FunctionField
        label="Status"
        render={(s: SlideRecord) => {
          const st = status(s);
          return <Chip size="small" label={st.label} color={st.color} />;
        }}
      />
    </Datagrid>
  </List>
  </>
);

/** Zdjęcie slajdu jako pole formularza (wgrywane od razu, w formularzu zostaje adres) */
const SlideImageInput = ({
  source,
  label,
  help,
  aspect,
  removable,
  isRequired,
}: {
  source: string;
  label: string;
  help: string;
  aspect: string;
  removable?: boolean;
  /** bez zdjęcia nie da się zapisać slajdu */
  isRequired?: boolean;
}) => {
  const { field, fieldState, formState } = useInput({
    source,
    validate: isRequired ? required('Wybierz zdjęcie – bez zdjęcia slajdu nie da się zapisać') : undefined,
  });
  const error = fieldState.error && (fieldState.isTouched || formState.isSubmitted) ? fieldState.error.message : null;
  return (
    <Box sx={{ width: '100%' }}>
      <ImageUploadField
        label={label + (isRequired ? ' *' : '')}
        value={(field.value as string | null) || null}
        onChange={(url) => {
          field.onChange(url ?? '');
          field.onBlur();
        }}
        help={help}
        aspect={aspect}
        removable={removable}
      />
      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: -1, mb: 2 }}>
          <ValidationError error={error} />
        </Typography>
      )}
    </Box>
  );
};


/**
 * „Wcześniejsze wersje” i „Przywróć stan domyślny” (slajdy startowe): wersja trafia do formularza bez zapisu.
 */
const SlideVersions = () => {
  const record = useRecordContext<SlideRecord>();
  const { setValue } = useFormContext();
  const { isDirty } = useFormState();
  const notify = useNotify();
  const [loaded, setLoaded] = useState<string | null>(null);
  if (!record) return null;
  const history = async () =>
    (await httpClient(`${apiUrl}/content/hero-slides/${record.id}/history`)).json as {
      revisions: Revision[];
      defaults: Record<string, unknown> | null;
    };
  const load = (data: Record<string, unknown>, label: string) => {
    for (const field of SLIDE_FIELDS)
      if (field in data) setValue(field, data[field] ?? null, { shouldDirty: true, shouldValidate: true });
    setLoaded(label);
  };
  const loadDefaults = async () => {
    try {
      const { defaults } = await history();
      if (defaults) load(defaults, 'stan domyślny (slajd z dnia uruchomienia strony)');
    } catch {
      notify('Nie udało się wczytać stanu domyślnego', { type: 'error' });
    }
  };
  return (
    <Box sx={{ mb: 2, width: '100%' }}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <VersionHistory
          revisions={async () => (await history()).revisions}
          load={load}
          summary={(d) => [d.titleLine1, d.titleLine2].filter(Boolean).join(' ') as string}
        />
        {record.defaultKey && (
          <Button color="inherit" startIcon={<RestartAltIcon />} onClick={loadDefaults}>
            Przywróć stan domyślny
          </Button>
        )}
      </Stack>
      {loaded && (
        <Alert severity="info" sx={{ mt: 1 }}>
          {isDirty
            ? `Wczytano ${loaded}. Sprawdź slajd i kliknij „Zapisz”, aby go przywrócić na stronie.`
            : `Wczytano ${loaded} – slajd na stronie już tak wygląda, nie trzeba nic zapisywać.`}
        </Alert>
      )}
    </Box>
  );
};

// kadr zdjęcia: która część ma być zawsze widoczna (zdjęcie wypełnia cały ekran i bywa przycinane)
const POSITIONS = [
  { id: 'center', name: 'Środek' },
  { id: '30% center', name: 'Bardziej z lewej' },
  { id: '70% center', name: 'Bardziej z prawej' },
  { id: 'center 30%', name: 'Bardziej u góry' },
  { id: 'center 70%', name: 'Bardziej u dołu' },
  { id: '60% center', name: 'Lekko z prawej' },
  { id: '65% center', name: 'Z prawej (65%)' },
];

const validateLink = (value?: string | null) =>
  value && !/^(\/\S*|https?:\/\/\S+|#newsletter)$/.test(value)
    ? 'Link musi zaczynać się od „/” (strona piekarni) albo „https://”, ewentualnie „#newsletter”'
    : undefined;

const validateEnd = (value: string | null, all: SlideRecord) =>
  value && all.startsAt && new Date(value) <= new Date(all.startsAt) ? 'Musi być później niż data rozpoczęcia' : undefined;

const KindInfo = () => {
  const record = useRecordContext<SlideRecord>();
  if (!record || record.kind === 'CUSTOM') return null;
  return (
    <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
      {KIND[record.kind].info}
    </Alert>
  );
};

/** Podgląd tekstu slajdu (wygląd jak na stronie, w uproszczeniu) */
const Preview = () => {
  const [eyebrow, line1, line2, text, cta1, cta2] = useWatch({
    name: ['eyebrow', 'titleLine1', 'titleLine2', 'text', 'cta1Label', 'cta2Label'],
  }) as (string | undefined)[];
  return (
    <Box sx={{ bgcolor: '#141618', color: '#f4efe6', p: 3, mb: 3, width: '100%', maxWidth: 560 }}>
      <Typography sx={{ color: '#c9a36a', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
        {eyebrow || 'Nadtytuł'}
      </Typography>
      <Typography sx={{ fontFamily: 'Oswald, sans-serif', fontSize: 36, lineHeight: 1.05, textTransform: 'uppercase', mt: 1 }}>
        {line1 || 'Tytuł'}
        {line2 && (
          <>
            <br />
            <span style={{ color: '#c9a36a' }}>{line2}</span>
          </>
        )}
      </Typography>
      <Typography sx={{ color: 'rgba(244,239,230,0.8)', mt: 1.5, fontSize: 14 }}>{text}</Typography>
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        {cta1 && <Box sx={{ bgcolor: '#c9a36a', color: '#141618', px: 2, py: 0.75, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{cta1}</Box>}
        {cta2 && <Box sx={{ border: '1px solid #f4efe6', px: 2, py: 0.75, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{cta2}</Box>}
      </Box>
    </Box>
  );
};

/** Slajdy automatyczne nie mają przycisku „Usuń” (można je wyłączyć) */
const FormToolbar = () => {
  const record = useRecordContext<SlideRecord>();
  return (
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton />
      {record && record.kind === 'CUSTOM' && (
        <DeleteWithConfirmButton confirmTitle={`Usunąć slajd „${record.name}”?`} confirmContent="Slajd zniknie z karuzeli." />
      )}
    </Toolbar>
  );
};

const SlideForm = () => (
  <SimpleForm toolbar={<FormToolbar />}>
    <KindInfo />
    <SlideVersions />
    <Preview />
    <Typography variant="h6" sx={{ mb: 1 }}>
      Tekst
    </Typography>
    <TextInput source="name" label="Nazwa slajdu (pod paskiem postępu)" validate={[required(), maxLength(20)]} helperText="Jedno, dwa słowa – najwyżej 20 znaków" />
    <TextInput source="eyebrow" label="Nadtytuł" fullWidth validate={maxLength(50)} helperText="Najwyżej 50 znaków" />
    <TextInput source="titleLine1" label="Tytuł – pierwsza linia" validate={[required(), maxLength(30)]} helperText="Najwyżej 30 znaków" />
    <TextInput source="titleLine2" label="Tytuł – druga linia (złota)" validate={maxLength(30)} helperText="Najwyżej 30 znaków; puste – tytuł w jednej linii" />
    <TextInput source="text" label="Opis" multiline fullWidth validate={maxLength(220)} helperText="Najwyżej 220 znaków (na telefonie widać ok. 3 linie). Znaczniki w tytule i opisie: {godzina}, {dni}, {limit} – aktualne zasady z „Rezerwacje → Zasady rezerwacji”." />

    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
      Przyciski
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextInput source="cta1Label" label="Przycisk główny – napis" validate={maxLength(30)} />
      <TextInput source="cta1Href" label="Przycisk główny – link" validate={validateLink} helperText="np. /oferta, /oferta/jagodzianka" />
    </Box>
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextInput source="cta2Label" label="Drugi przycisk – napis (opcjonalnie)" validate={maxLength(30)} />
      <TextInput source="cta2Href" label="Drugi przycisk – link" validate={validateLink} />
    </Box>

    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
      Zdjęcia
    </Typography>
    <SlideImageInput
      source="imageUrl"
      label="Zdjęcie na komputer"
      help="Wymagane. Poziome, duże (najlepiej 2400 px szerokości). Tekst jest po lewej – ważny fragment zdjęcia najlepiej po prawej."
      aspect="16 / 9"
      isRequired
    />
    <SelectInput source="imagePosition" label="Kadr na komputerze" choices={POSITIONS} defaultValue="center" />
    <TextInput source="imageAlt" label="Opis zdjęcia (dla niewidomych i Google)" fullWidth validate={maxLength(160)} />
    <SlideImageInput
      source="mobileImageUrl"
      label="Zdjęcie na telefon (opcjonalnie)"
      help="Pionowe. Puste – na telefonie pokaże się zdjęcie z komputera."
      aspect="3 / 4"
      removable
    />
    <SelectInput source="mobileImagePosition" label="Kadr na telefonie" choices={POSITIONS} defaultValue="center" />

    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
      Wyświetlanie
    </Typography>
    <BooleanInput source="isActive" label="Włączony" defaultValue={true} />
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <DateTimeInput source="startsAt" label="Od" helperText="Puste = od razu" />
      <DateTimeInput source="endsAt" label="Do" validate={validateEnd} helperText="Puste = bezterminowo; po tej dacie slajd zniknie sam" />
    </Box>
    <NumberInput source="order" label="Kolejność" helperText="Mniejsza liczba = wcześniej w karuzeli" />
  </SimpleForm>
);

export const HeroSlideCreate = () => (
  <Create title="Nowy slajd" redirect="list">
    <SlideForm />
  </Create>
);

export const HeroSlideEdit = () => (
  <Edit title="Slajd karuzeli" redirect="list" mutationMode="pessimistic">
    <SlideForm />
  </Edit>
);
