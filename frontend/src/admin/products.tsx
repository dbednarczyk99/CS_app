import { List, Datagrid, TextField, NumberField } from 'react-admin';

export const ProductList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="price" />
    </Datagrid>
  </List>
);
