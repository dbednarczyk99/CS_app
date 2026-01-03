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
      <RATextField source="googleMapsUrl" />
    </Datagrid>
  </List>
);

export const LocationCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Name" />
      <TextInput source="address" label="Address" validate={[required()]} />
      <TextInput source="googleMapsUrl" label="Google Maps URL" validate={[required()]} />
      <h3 style={{ marginLeft: 16 }}>Opening Hours</h3>
      {weekdayOrder.map((day) => (
        <div key={day} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8, marginLeft: 16 }}>
          <div style={{ width: 110 }}>{weekdayLabel[day]}</div>
          <TextInput
            source={`openingHours.${day}.openFrom`}
            label="From"
            validate={[required()]}
            InputProps={{ inputProps: { type: 'time' } }}
            style={{ width: 180 }}
          />
          <TextInput
            source={`openingHours.${day}.openTo`}
            label="To"
            validate={[required()]}
            InputProps={{ inputProps: { type: 'time' } }}
            style={{ width: 150 }}
          />
        </div>
      ))}
    </SimpleForm>
  </Create>
);

export const LocationEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Name" />
      <TextInput source="address" label="Address" validate={[required()]} />
      <TextInput source="googleMapsUrl" label="Google Maps URL" validate={[required()]} />
      <h3 style={{ marginLeft: 16 }}>Opening Hours</h3>
      {weekdayOrder.map((day) => (
        <div key={day} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 0, marginLeft: 16 }}>
          <div style={{ width: 110 }}>{weekdayLabel[day]}</div>
          <TextInput
            source={`openingHours.${day}.openFrom`}
            label="From"
            validate={[required()]}
            InputProps={{ inputProps: { type: 'time' } }}
            style={{ width: 180, margin: 0}}
          />
          <TextInput
            source={`openingHours.${day}.openTo`}
            label="To"
            validate={[required()]}
            InputProps={{ inputProps: { type: 'time' } }}
            style={{ width: 180, margin: 0 }}
          />
        </div>
      ))}
    </SimpleForm>
  </Edit>
);