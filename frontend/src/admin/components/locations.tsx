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
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormControlLabel, Switch } from '@mui/material';
import { CoordinatesInput } from '../common/CoordinatesInput';
import SortableImageInput from '../common/SortableImageInput';

type Weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

const weekdayOrder: Weekday[] = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
];

const weekdayLabel: Record<Weekday, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};

export const LocationList = () => (
  <List>
    <Datagrid rowClick="edit">
      <RATextField source="name" />
      <RATextField source="address" />
      <RATextField source="phone" />
      <RATextField source="code" label="Kod" />
      <RATextField source="googleMapsUrl" />
    </Datagrid>
  </List>
);

// wspólny formularz dla tworzenia i edycji
const LocationForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Name" />
    <TextInput source="address" label="Address" validate={[required()]} />
    <TextInput source="phone" label="Phone" />
    <TextInput source="code" label="Kod do numerów rezerwacji (np. WIL)" helperText="2–6 liter; puste = z nazwy ulicy" />
    <TextInput source="googleMapsUrl" label="Google Maps URL" validate={[required()]} />
    <CoordinatesInput />
    <h3 style={{ marginLeft: 16, marginBottom: 0 }}>Zdjęcia lokalu</h3>
    <p style={{ marginLeft: 16, marginTop: 4, color: '#666', fontSize: 14 }}>
      Karuzela na stronie /piekarnie, pierwsze zdjęcie pokazuje się od razu.
    </p>
    <SortableImageInput source="images" validate={false} maxQty={6} />
    <h3 style={{ marginLeft: 16, marginBottom: 0 }}>Opening Hours</h3>
    <p style={{ marginLeft: 16, marginTop: 4, color: '#666', fontSize: 14 }}>
      Wyłącz „Czynne”, jeśli lokal jest w ten dzień zamknięty.
    </p>
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
  // otwarty dzień bez wpisanych jeszcze godzin też ma pokazywać pola
  const [open, setOpen] = useState(hasHours);
  useEffect(() => {
    if (hasHours) setOpen(true);
  }, [hasHours]);

  const toggle = (checked: boolean) => {
    setOpen(checked);
    if (!checked) {
      setValue(`openingHours.${day}`, null, { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', minHeight: 64, marginLeft: 16 }}>
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
            label="From"
            validate={validateFrom}
            InputProps={{ inputProps: { type: 'time' } }}
            InputLabelProps={{ shrink: true }}
            style={{ width: 180, margin: 0 }}
            helperText={false}
          />
          <TextInput
            source={`openingHours.${day}.openTo`}
            label="To"
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
  <Create>
    <LocationForm />
  </Create>
);

export const LocationEdit = () => (
  <Edit>
    <LocationForm />
  </Edit>
);
