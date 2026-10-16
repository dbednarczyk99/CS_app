import {
  List,
  Datagrid,
  TextField,
  Create,
  Edit,
  DateField,
  FunctionField,
  SimpleForm,
  TextInput,
  required,
} from 'react-admin';
import { Chip, Stack } from '@mui/material';
import TagInput from '../common/TagInput';
import SortableImageInput from '../common/SortableImageInput';

export const BlogList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="title" label="Title" />
      <TextField source="shortDescription" label="Short description" />

      {/* tagi są we wpisie jako relacja { tag: { name } } */}
      <FunctionField
        label="Tags"
        render={(record: { tags?: { tag: { id: string; name: string } }[] }) => (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {(record.tags ?? []).map(({ tag }) => (
              <Chip key={tag.id} label={tag.name} size="small" />
            ))}
          </Stack>
        )}
      />

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
