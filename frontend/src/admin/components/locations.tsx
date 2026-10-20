import { FormUnsavedChanges } from '../common/UnsavedChanges';
import { MobileList } from '../common/MobileList';
import {
  List,
  Datagrid,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  TextField as RATextField,
  required,
  useRecordContext,
  useNotify,
  useRefresh,
} from 'react-admin';
import { useState } from 'react';
import { apiUrl, httpClient } from '../../dataProvider';
import { useFormContext, useWatch } from 'react-hook-form';
import { Box, Button, FormControlLabel, Link, Switch, Typography } from '@mui/material';
import { CoordinatesInput } from '../common/CoordinatesInput';
import SortableImageInput from '../common/SortableImageInput';

type Weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

const weekdayOrder: Weekday[] = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
];

const weekdayLabel: Record<Weekday, string> = {
  MONDAY: 'Poniedziałek',
  TUESDAY: 'Wtorek',
  WEDNESDAY: 'Środa',
  THURSDAY: 'Czwartek',
  FRIDAY: 'Piątek',
  SATURDAY: 'Sobota',
  SUNDAY: 'Niedziela',
};

export const LocationList = () => (
  <List title="Piekarnie">
    <MobileList
      primaryText={(l) => l.address}
      secondaryText={(l) => [l.name, l.phone].filter(Boolean).join(' · ')}
      rowClick="edit"
    >
    <Datagrid rowClick="edit">
      <RATextField source="name" />
      <RATextField source="address" />
      <RATextField source="phone" />
      <RATextField source="code" label="Kod" />
      <RATextField source="googleMapsUrl" />
    </Datagrid>
    </MobileList>
  </List>
);

/** Nagłówek części formularza z krótką podpowiedzią */
const SectionTitle = ({ title, hint }: { title: string; hint: string }) => (
  <Box sx={{ mt: 3, mb: 1 }}>
    <Typography variant="h6" sx={{ fontSize: '1.05rem' }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {hint}
    </Typography>
  </Box>
);

type GoogleRecord = {
  googlePlaceId?: string | null;
  googleRating?: number | null;
  googleRatingCount?: number | null;
  googleRatingAt?: string | null;
};

/** „1 opinia”, „24 opinie”, „136 opinii” */
const opinions = (n: number) => {
  const last = n % 10;
  const lastTwo = n % 100;
  const word = n === 1 ? 'opinia' : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'opinie' : 'opinii';
  return `${n} ${word}`;
};

/** Ocena z Google (odświeżana raz dziennie) – informacja pod polem identyfikatora miejsca */
const GoogleRatingInfo = () => {
  const record = useRecordContext<GoogleRecord & { id: string }>();
  const notify = useNotify();
  const refresh = useRefresh();
  const [loading, setLoading] = useState(false);
  if (!record?.googlePlaceId) return null;

  // „Odśwież ocenę teraz” – np. zaraz po dodaniu klucza Google (inaczej ocena odświeża się codziennie o 6:15)
  const refreshNow = async () => {
    setLoading(true);
    try {
      await httpClient(`${apiUrl}/contact/locations/${record.id}/refresh-rating`, { method: 'POST' });
      notify('Ocena z Google pobrana', { type: 'success' });
      refresh();
    } catch (error) {
      notify((error as { body?: { message?: string } }).body?.message ?? 'Nie udało się pobrać oceny z Google', {
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Typography variant="body2" color="text.secondary">
        {record.googleRating != null
          ? `Ocena w Google: ${record.googleRating.toFixed(1).replace('.', ',')} ★ (${opinions(record.googleRatingCount ?? 0)}), pobrana ${new Date(record.googleRatingAt!).toLocaleString('pl-PL')}. Odświeża się codziennie rano.`
          : 'Ocena z Google jeszcze nie została pobrana (link „Oceń nas w Google” działa już teraz).'}
      </Typography>
      <Button size="small" variant="outlined" onClick={refreshNow} disabled={loading}>
        {loading ? 'Pobieranie…' : 'Odśwież ocenę teraz'}
      </Button>
    </Box>
  );
};

// wspólny formularz dla tworzenia i edycji
const LocationForm = () => (
  <SimpleForm>
    <FormUnsavedChanges />
    <TextInput source="name" label="Nazwa (opcjonalnie)" />
    <TextInput source="address" label="Adres" validate={[required()]} helperText="np. „ul. Wileńska 4, 31-413 Kraków”" />
    <TextInput source="phone" label="Telefon" />
    <TextInput source="code" label="Kod do numerów rezerwacji (np. WIL)" helperText="2–6 liter; puste = z nazwy ulicy" />
    <TextInput source="googleMapsUrl" label="Link Google Maps" validate={[required()]} helperText="Link do wizytówki piekarni w Mapach Google (przycisk „Nawiguj”)" />
    <CoordinatesInput />
    <SectionTitle
      title="Opinie Google"
      hint="Identyfikator miejsca (Place ID) – na stronie pojawi się ocena piekarni i link „Oceń nas w Google”."
    />
    <TextInput
      source="googlePlaceId"
      label="Identyfikator miejsca Google (Place ID)"
      fullWidth
      helperText={
        <>
          Zaczyna się zwykle od „ChIJ”. Znajdziesz go, wpisując adres piekarni na stronie{' '}
          <Link href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noreferrer">
            Place ID Finder
          </Link>
          . Puste – bez oceny i linku.
        </>
      }
    />
    <GoogleRatingInfo />
    <SectionTitle title="Zdjęcia lokalu" hint="Karuzela na stronie „Piekarnie”; pierwsze zdjęcie pokazuje się od razu. Kolejność zmienisz, przeciągając zdjęcia." />
    <SortableImageInput source="images" validate={false} maxQty={6} />
    <SectionTitle title="Godziny otwarcia" hint="Wyłącz „Czynne”, jeśli lokal jest w ten dzień zamknięty." />
    {weekdayOrder.map((day) => (
      <DayHours key={day} day={day} />
    ))}
  </SimpleForm>
);

type DaySpan = { openFrom?: string | null; openTo?: string | null } | null | undefined;

// obie godziny albo żadna; zamknięcie po otwarciu
const validateFrom = (value: string | null, all: { openingHours?: Record<string, DaySpan> }, props: { source: string }) => {
  const day = props.source.split('.')[1];
  const to = all.openingHours?.[day]?.openTo;
  if (!value && to) return 'Podaj godzinę otwarcia';
  return undefined;
};
const validateTo = (value: string | null, all: { openingHours?: Record<string, DaySpan> }, props: { source: string }) => {
  const day = props.source.split('.')[1];
  const from = all.openingHours?.[day]?.openFrom;
  if (!value && from) return 'Podaj godzinę zamknięcia';
  if (value && from && value <= from) return 'Musi być po otwarciu';
  return undefined;
};

/** Jeden dzień: przełącznik czynne/nieczynne + godziny od–do */
const DayHours = ({ day }: { day: Weekday }) => {
  const { setValue } = useFormContext();
  const span = useWatch({ name: `openingHours.${day}` }) as DaySpan;
  const hasHours = !!(span?.openFrom || span?.openTo);
  // dzień z godzinami jest czynny; włączony przełącznikiem dzień bez wpisanych jeszcze godzin też pokazuje pola
  const [switchedOn, setOpen] = useState(false);
  const open = hasHours || switchedOn;

  const toggle = (checked: boolean) => {
    setOpen(checked);
    if (!checked) {
      setValue(`openingHours.${day}`, null, { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', minHeight: 64, flexWrap: 'wrap' }}>
      <div style={{ width: 110 }}>{weekdayLabel[day]}</div>
      <FormControlLabel
        control={<Switch checked={open} onChange={(e) => toggle(e.target.checked)} />}
        label={open ? 'Czynne' : 'Nieczynne'}
        style={{ width: 150 }}
      />
      {open && (
        <>
          <TextInput
            source={`openingHours.${day}.openFrom`}
            label="Od"
            validate={validateFrom}
            InputProps={{ inputProps: { type: 'time' } }}
            InputLabelProps={{ shrink: true }}
            style={{ width: 180, margin: 0 }}
            helperText={false}
          />
          <TextInput
            source={`openingHours.${day}.openTo`}
            label="Do"
            validate={validateTo}
            InputProps={{ inputProps: { type: 'time' } }}
            InputLabelProps={{ shrink: true }}
            style={{ width: 180, margin: 0 }}
            helperText={false}
          />
        </>
      )}
    </div>
  );
};

export const LocationCreate = () => (
  <Create title="Nowa piekarnia">
    <LocationForm />
  </Create>
);

export const LocationEdit = () => (
  <Edit>
    <LocationForm />
  </Edit>
);
