import { MobileList } from '../common/MobileList';
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
import { Alert, Box, Tab, Tabs } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { CoordinatesInput } from '../common/CoordinatesInput';
import { ImagePreview } from '../common/ImagePreview';
import SortableImageInput from '../common/SortableImageInput';
import { weekdayName, weekdayOption } from '../common/weekdays';

/** Jeden ekran „Chlebowóz” w menu: zakładki Trasa | Opis i zdjęcia (dwa zasoby API pod spodem) */
const BreadVanTabs = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const value = pathname.startsWith('/bread-van/description') ? '/bread-van/description/view/show' : '/bread-van/locations';
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
      <Tabs value={value} onChange={(_, to: string) => navigate(to)}>
        <Tab label="Trasa" value="/bread-van/locations" />
        <Tab label="Opis i zdjęcia" value="/bread-van/description/view/show" />
      </Tabs>
    </Box>
  );
};

export const BreadVanDescriptionShow = () => (
  <>
  <BreadVanTabs />
  <Show resource="bread-van/description" id="singleton" title="Chlebowóz">
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
  </>
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
  <>
  <BreadVanTabs />
  <List resource="bread-van/locations" title="Chlebowóz" pagination={false}>
    <Box sx={{ px: 2, pt: 2 }}>
      <Alert severity="info" variant="outlined">
        Jeden przystanek na dzień tygodnia. Dzień, w którym chlebowóz nie kursuje, po prostu usuń z listy – na stronie
        pojawi się przy nim informacja „Chlebowóz odpoczywa”.
      </Alert>
    </Box>
    <MobileList
      primaryText={(s) => s.address}
      secondaryText={(s) => `${weekdayName(s.dayOfTheWeek)} · ${s.startTime}–${s.endTime}`}
      rowClick="edit"
    >
    <Datagrid rowClick="edit">
      <WeekdayTextField source="dayOfTheWeek" label="Dzień tygodnia" />
      <TextField source="startTime" />
      <TextField source="endTime" />
      <TextField source="address" />
      <TextField source="googleMapsUrl" />
    </Datagrid>
    </MobileList>
  </List>
  </>
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
