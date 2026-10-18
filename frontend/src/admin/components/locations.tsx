import {
  List,
  Datagrid,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  TextField as RATextField,
  required
} from 'react-admin';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
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
    <Datagrid rowClick="edit">
      <RATextField source="name" />
      <RATextField source="address" />
      <RATextField source="phone" />
      <RATextField source="code" label="Kod" />
      <RATextField source="googleMapsUrl" />
    </Datagrid>
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

// wspólny formularz dla tworzenia i edycji
const LocationForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Nazwa (opcjonalnie)" />
    <TextInput source="address" label="Adres" validate={[required()]} helperText="np. „ul. Wileńska 4, 31-413 Kraków”" />
    <TextInput source="phone" label="Telefon" />
    <TextInput source="code" label="Kod do numerów rezerwacji (np. WIL)" helperText="2–6 liter; puste = z nazwy ulicy" />
    <TextInput source="googleMapsUrl" label="Link Google Maps" validate={[required()]} helperText="Link do wizytówki piekarni w Mapach Google (przycisk „Nawiguj”)" />
    <CoordinatesInput />
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
