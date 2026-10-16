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
      Puste godziny = lokal nieczynny w ten dzień.
    </p>
    {weekdayOrder.map((day) => (
      <div key={day} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 0, marginLeft: 16 }}>
        <div style={{ width: 110 }}>{weekdayLabel[day]}</div>
        <TextInput
          source={`openingHours.${day}.openFrom`}
          label="From"
          InputProps={{ inputProps: { type: 'time' } }}
          InputLabelProps={{ shrink: true }}
          style={{ width: 180, margin: 0 }}
        />
        <TextInput
          source={`openingHours.${day}.openTo`}
          label="To"
          InputProps={{ inputProps: { type: 'time' } }}
          InputLabelProps={{ shrink: true }}
          style={{ width: 180, margin: 0 }}
        />
      </div>
    ))}
  </SimpleForm>
);

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
