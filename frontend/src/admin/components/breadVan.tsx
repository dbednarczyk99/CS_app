import {
    // EditableDataGrid,
    Show,
    Datagrid,
    TextField,
    // Create,
    // SimpleForm,
    // TextInput,
    ArrayField,
    ImageField,
    SingleFieldList,
    // Toolbar,
    // SaveButton,
    // DeleteButton,
    // useRecordContext,
    // useRedirect,
    // Edit,
    // required,
    RichTextField,
    SimpleShowLayout,
    List,
} from 'react-admin';
//import { Box, Typography, Button} from '@mui/material';

export const BreadVanDescriptionShow = () => (
  <div>
    <Show resource="bread-van/description" id="b0fdfb94-7f07-47cd-8771-3fe21b17137a">
      <SimpleShowLayout>
        <RichTextField source="shortDescription" />
        <RichTextField source="longDescription" />
        <ArrayField source="images">
          <SingleFieldList>
            <ImageField source="imgUrl" sx={{ maxWidth: 200, maxHeight: 200 }} />
          </SingleFieldList>
        </ArrayField>
      </SimpleShowLayout>
    </Show>
    <List resource="bread-van/schedule">
        <Datagrid rowClick="edit">
          <TextField source="address" />
          <TextField source="googleMapsUrl" />
          <TextField source="dayOfTheWeek" />
        </Datagrid>
    </List>
  </div>

)