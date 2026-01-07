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
    useRedirect,
    Edit,
    required,
} from 'react-admin';
import { Box, Typography, Button} from '@mui/material';

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
      {!hasProducts && <DeleteButton sx={{ ml: 2 }} />}
    </Toolbar>
  );
};

const AddProductButton = () => {
  const record = useRecordContext<{ id: string }>();
  const redirect = useRedirect();

  if (!record) return null;

  const handleClick = () => {
    redirect('create', 'products', undefined, { categoryId: record.id });
  };

  return (
    <Button
      variant="contained"
      size="small"
      sx={{ mx: 2 }}
      onClick={handleClick}
    >
      Create product
    </Button>
  );
};

export const CategoryEdit = () => (
  <Edit>
    <SimpleForm toolbar={<CategoryEditToolbar />}>
      <TextInput source="name" validate={[required()]} />
    </SimpleForm>

    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ml: 2, my: 2, mt: 6 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
          Products in this category
        </Typography>
        <AddProductButton />
      </Box>

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