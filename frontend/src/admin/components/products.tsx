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
  ImageInput,
  ImageField,
  required,
  BooleanField,
} from 'react-admin';

export const ProductList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <NumberField source="price" />
      <TextField source="description" />
      <TextField source="category.name" label="Kategoria" />

      <BooleanField source="isSeasonal" />
      <BooleanField source="isActive" />
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
        label="Czy sezonowy?"
        defaultValue={false}
        validate={[required()]}
      />

      <BooleanInput
        source="isActive"
        label="Aktywny produkt"
        defaultValue={true}
        validate={[required()]}
      />

      <ReferenceInput
        label="Kategoria"
        source="categoryId"
        reference="products/categories"
      >
        <SelectInput optionText="name" validate={[required()]} />
      </ReferenceInput>

      <ImageInput
        source="images"
        label="Zdjęcia"
        multiple
        validate={[required()]}
      >
        {/* RA używa src dla podglądu; src dodajemy w dataProviderze z imgUrl */}
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);

export const ProductEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <NumberInput source="price" validate={[required()]} />
      <TextInput source="description" validate={[required()]} />

      <BooleanInput source="isSeasonal" />
      <BooleanInput source="isActive" />

      <ReferenceInput
        label="Kategoria"
        source="categoryId"
        reference="products/categories"
      >
        <SelectInput optionText="name" validate={[required()]} />
      </ReferenceInput>

      <ImageInput
        source="images"
        label="Zdjęcia"
        multiple
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);