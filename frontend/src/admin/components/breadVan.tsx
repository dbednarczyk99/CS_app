// admin/components/breadVan.tsx

import {
  Show,
  Edit,
  SimpleShowLayout,
  SimpleForm,
  TextInput,
  RichTextField,
  ArrayField,
  SingleFieldList,
  ImageField,
  List,
  Datagrid,
  TextField,
  required,
  minLength,
  maxLength,
  useRecordContext,
  Create,
  SelectInput,
  type RaRecord,
} from 'react-admin';
import { Alert, Box } from '@mui/material';
import { CoordinatesInput } from '../common/CoordinatesInput';
import { ImagePreview } from '../common/ImagePreview';
import SortableImageInput from '../common/SortableImageInput';
import { weekdayName, weekdayOption } from '../common/weekdays';

export const BreadVanDescriptionShow = () => (
  <Show resource="bread-van/description" id="singleton" title="Chlebowóz – opis i zdjęcia">
    <SimpleShowLayout>
      <RichTextField source="shortDescription" />
      <RichTextField source="longDescription" />

      <ArrayField source="images">
        <SingleFieldList linkType={false}>
          <ImagePreview>
            <ImageField source="imgUrl" />
          </ImagePreview>
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export const BreadVanDescriptionEdit = () => (
  <Edit resource="bread-van/description" id="singleton" title="Chlebowóz – edycja opisu">
    <SimpleForm>
      <TextInput
        source="shortDescription"
        fullWidth
        multiline
        validate={[required(), minLength(20), maxLength(60)]}
        helperText="20–60 znaków"
      />
      <TextInput
        source="longDescription"
        fullWidth
        multiline
        validate={[required(), minLength(200), maxLength(500)]}
        helperText="200–500 znaków"
      />
      <SortableImageInput source="images" validate={true} maxQty={5} />
    </SimpleForm>
  </Edit>
);

const WeekdayTextField = ({ source }: { source: string; label?: string }) => {
  const record = useRecordContext<RaRecord>();
  if (!record) return null;
  return <span>{weekdayName(record[source] as string)}</span>;
};

export const BreadVanScheduleList = () => (
  <List resource="bread-van/locations" title="Trasa chlebowozu" pagination={false}>
    <Box sx={{ px: 2, pt: 2 }}>
      <Alert severity="info" variant="outlined">
        Jeden przystanek na dzień tygodnia. Dzień, w którym chlebowóz nie kursuje, po prostu usuń z listy – na stronie
        pojawi się przy nim informacja „Chlebowóz odpoczywa”.
      </Alert>
    </Box>
    <Datagrid rowClick="edit">
      <WeekdayTextField source="dayOfTheWeek" label="Dzień tygodnia" />
      <TextField source="startTime" />
      <TextField source="endTime" />
      <TextField source="address" />
      <TextField source="googleMapsUrl" />
    </Datagrid>
  </List>
);

const ScheduleForm = () => (
  <SimpleForm>
    <SelectInput
      source="dayOfTheWeek"
      choices={weekdayOption}
      optionValue="id"
      optionText="text"
      validate={[required()]}
    />
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextInput source="startTime" type="time" validate={[required()]} InputLabelProps={{ shrink: true }} />
      <TextInput source="endTime" type="time" validate={[required()]} InputLabelProps={{ shrink: true }} />
    </Box>

    <TextInput source="address" validate={[required()]} helperText="np. „Plac Inwalidów, Kraków” – tak wyświetli się na stronie" />
    <TextInput source="googleMapsUrl" validate={[required()]} />
    <CoordinatesInput />
  </SimpleForm>
);

export const BreadVanScheduleCreate = () => (
  <Create resource="bread-van/locations" title="Nowy przystanek" redirect="list">
    <ScheduleForm />
  </Create>
);

export const BreadVanScheduleEdit = () => (
  <Edit resource="bread-van/locations" redirect="list">
    <ScheduleForm />
  </Edit>
);
