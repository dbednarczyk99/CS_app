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
  useRecordContext,
  Create,
  SelectInput,
  type RaRecord,
} from 'react-admin';
import { ImagePreview } from '../common/ImagePreview';
import SortableImageInput from '../common/SortableImageInput';

export const BreadVanDescriptionShow = () => (
  <Show resource="bread-van/description" id="singleton">
    <SimpleShowLayout>
      <RichTextField source="shortDescription" />
      <RichTextField source="longDescription" />

      <ArrayField source="images" >
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
  <Edit resource="bread-van/description" id="singleton">
    <SimpleForm>
      <TextInput 
        source="shortDescription"
        fullWidth
        multiline
        validate={[required()]}
      />
      <TextInput
        source="longDescription"
        fullWidth
        multiline
        validate={[required()]}
      />
      <SortableImageInput source="images" />
    </SimpleForm>
  </Edit>
);

const weekdayOption = [
  {id: 'MONDAY', text: 'Monday'},
  {id: 'TUESDAY', text: 'Tuesday'},
  {id: 'WEDNESDAY', text: 'Wednesday'},
  {id: 'THURSDAY', text: 'Thursday'},
  {id: 'FRIDAY', text: 'Friday'},
  {id: 'SATURDAY', text: 'Saturday'},
  {id: 'SUNDAY', text: 'Sunday'}
]

const WeekdayTextField = ({ source }: { source: string }) => {
  const record = useRecordContext<RaRecord>();
  if (!record) return null;

  const type = record[source] as string | undefined;

  const label =
    weekdayOption.find(option => option.id === type)?.text ?? type;

  return <span>{label}</span>;
};

export const BreadVanScheduleList = () => (
  <List resource="bread-van/locations">
    <Datagrid rowClick="edit">
      <WeekdayTextField source="dayOfTheWeek" />
      <TextField source="startTime" />
      <TextField source="endTime" />
      <TextField source="address" />
      <TextField source="googleMapsUrl" />
    </Datagrid>
  </List>
);

export const BreadVanScheduleCreate = () => (
  <Create resource="bread-van/locations">
    <SimpleForm>
      <SelectInput
        source="dayOfTheWeek"
        choices={weekdayOption}
        optionValue='id'
        optionText='text'
        validate={[required()]}  
      />
        <div style={{display: 'flex', gap: '10px'}}>
          <TextInput source="startTime" type="time" validate={[required()]} />
          <TextInput source="endTime" type="time" validate={[required()]} />
        </div>
      
      <TextInput source="address" validate={[required()]} />
      <TextInput source="googleMapsUrl" validate={[required()]} />
    </SimpleForm>
  </Create>
);

export const BreadVanScheduleEdit = () => (
  <Edit resource="bread-van/locations">
    <SimpleForm>
      <SelectInput
        source="dayOfTheWeek"
        choices={weekdayOption}
        optionValue='id'
        optionText='text'
        validate={[required()]}  
      />
        <div style={{display: 'flex', gap: '10px'}}>
          <TextInput source="startTime" type="time" validate={[required()]} />
          <TextInput source="endTime" type="time" validate={[required()]} />
        </div>
      
      <TextInput source="address" validate={[required()]} />
      <TextInput source="googleMapsUrl" validate={[required()]} />
    </SimpleForm>
  </Edit>
);