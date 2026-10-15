import {
  List,
  Datagrid,
  TextField,
  NumberField,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  Edit,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  required,
  BooleanField,
} from 'react-admin';
import SortableImageInput from '../common/SortableImageInput';

export const ProductList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <NumberField source="price" />
      <TextField source="description" />
      <TextField source="category.name" label="Kategoria" />

      <BooleanField source="isSeasonal" />
      <BooleanField source="isActive" />
      <BooleanField source="isReservable" label="Rezerwacja" />
    </Datagrid>
  </List>
);

export const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <NumberInput source="price" validate={[required()]} />
      <TextInput source="description" validate={[required()]} />

      <BooleanInput
        source="isSeasonal"
        label="Is it seasonal?"
        defaultValue={false}
        validate={[required()]}
      />

      <BooleanInput
        source="isActive"
        label="Is it active?"
        defaultValue={true}
        validate={[required()]}
      />

      <BooleanInput
        source="isReservable"
        label="Można rezerwować online"
        defaultValue={true}
      />

      <ReferenceInput
        label="Category"
        source="categoryId"
        reference="products/categories"
      >
        <SelectInput optionText="name" validate={[required()]} />
      </ReferenceInput>

      <SortableImageInput source="images" validate={true} maxQty={3} />
    </SimpleForm>
  </Create>
);

export const ProductEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <NumberInput source="price" validate={[required()]} />
      <TextInput source="description" validate={[required()]} />
      <BooleanInput source="isSeasonal" label="Is it Seasonal?" />
      <BooleanInput source="isActive" label="Is it Active?" />
      <BooleanInput source="isReservable" label="Można rezerwować online" />

      <ReferenceInput
        label="Category"
        source="categoryId"
        reference="products/categories"
      >
        <SelectInput optionText="name" validate={[required()]} />
      </ReferenceInput>

      <SortableImageInput source="images" validate={true} maxQty={3} />
    </SimpleForm>
  </Edit>
);