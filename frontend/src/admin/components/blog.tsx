import {
  List,
  Datagrid,
  TextField,
  Create,
  Edit,
  DateField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  SimpleForm,
  TextInput,
  required,
} from 'react-admin';
import TagInput from '../common/TagInput';
import SortableImageInput from '../common/SortableImageInput';

export const BlogList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="title" label="Title" />
      <TextField source="shortDescription" label="Short description" />

      <ReferenceArrayField source="tags" reference="tags">
        <SingleFieldList>
          <ChipField source="name" size="small" />
        </SingleFieldList>
      </ReferenceArrayField>

      <DateField source="createdAt" />
    </Datagrid>
  </List>
);

export const BlogCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="shortDescription" multiline />
      <TextInput source="content" multiline />

      <TagInput />

      <SortableImageInput source="images" maxQty={5} />
    </SimpleForm>
  </Create>
);

export const BlogEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="shortDescription" multiline />
      <TextInput source="content" multiline />

      <TagInput />

      <SortableImageInput source="images" maxQty={5} />
    </SimpleForm>
  </Edit>
);
