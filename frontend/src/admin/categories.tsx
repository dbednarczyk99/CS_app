import {
    List,
    Datagrid,
    TextField,
    Create,
    SimpleForm,
    TextInput,
    ArrayField,
    Toolbar,
    SaveButton,
    DeleteButton,
    useRecordContext,
    Edit,
    required,
} from 'react-admin';
import { Box, Typography } from '@mui/material';

import type { ToolbarProps } from '@mui/material';
type CategoryRecord = {
  products?: unknown[];
};

export const CategoryList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" />
    </Datagrid>
  </List>
);

export const CategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
    </SimpleForm>
  </Create>
);

const CategoryEditToolbar = (props: ToolbarProps) => {
  const record = useRecordContext<CategoryRecord>();
  const hasProducts = (record?.products ?? []).length > 0;

  return (
    <Toolbar {...props}>
      <SaveButton />
      {/* pokaż DELETE tylko gdy brak produktów */}
      {!hasProducts && <DeleteButton sx={{ ml: 2 }} />}
    </Toolbar>
  );
};

export const CategoryEdit = () => (
  <Edit>
    <SimpleForm toolbar={<CategoryEditToolbar />}>
      <TextInput source="name" validate={[required()]} />
    </SimpleForm>

    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ ml: 2 }}>
        Products in this category
      </Typography>

      <ArrayField source="products">
        <Datagrid
          bulkActionButtons={false}
          isRowSelectable={() => false}
          sx={{
            width: '100%',
            '& .RaDatagrid-headerCell-checkbox': { display: 'none' },
            '& .RaDatagrid-rowCell-checkbox': { display: 'none' },
          }}
          rowClick={(id) => `/products/${id}`}
          empty={
            <Box sx={{ p: 2 }}>
              <Typography>No products found</Typography>
            </Box>
          }
        >
          <TextField source="name" />
        </Datagrid>
      </ArrayField>
    </Box>
  </Edit>
);