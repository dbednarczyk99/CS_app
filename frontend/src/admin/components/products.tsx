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
  required,
  BooleanField,
  ImageField,
} from 'react-admin';
import { ImagePreview } from '../common/ImagePreview';

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

      <ReferenceInput
        label="Category"
        source="categoryId"
        reference="products/categories"
      >
        <SelectInput optionText="name" validate={[required()]} />
      </ReferenceInput>

      <ImageInput
        source="images"
        label="Images"
        multiple
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
        maxSize={5000000} // 5MB
        validate={[required()]}
      >
        {/* RA używa src dla podglądu; src dodajemy w dataProviderze z imgUrl */}
        {/*<ImageField source="src" title="title" />*/}
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
      <BooleanInput source="isSeasonal" label="Is it Seasonal?" />
      <BooleanInput source="isActive" label="Is it Active?" />

      <ReferenceInput
        label="Category"
        source="categoryId"
        reference="products/categories"
      >
        <SelectInput optionText="name" validate={[required()]} />
      </ReferenceInput>

      <ImageInput
        source="images"
        label="Images"
        multiple
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
        maxSize={5000000} // 5MB
        validate={[required()]}
      >
        <ImagePreview>
          <ImageField source="src" title="title" />
        </ImagePreview>

      </ImageInput>

    </SimpleForm>
  </Edit>
);