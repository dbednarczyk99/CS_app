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
  FunctionField,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import SortableImageInput from '../common/SortableImageInput';

/** Przełącznik „W sezonie” – tylko dla produktów sezonowych */
const InSeasonInput = () => {
  const isSeasonal = useWatch({ name: 'isSeasonal' }) as boolean | undefined;
  if (!isSeasonal) return null;
  return (
    <BooleanInput
      source="inSeason"
      label="W sezonie – teraz dostępny"
      defaultValue={true}
      helperText="Wyłączony: produkt zostaje na stronie w sekcji „Wrócą w sezonie”, bez ceny i rezerwacji"
    />
  );
};

export const ProductList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <NumberField source="price" />
      <TextField source="description" />
      <TextField source="category.name" label="Kategoria" />

      <BooleanField source="isSeasonal" />
      <FunctionField
        label="Sezon"
        render={(p: { isSeasonal: boolean; inSeason: boolean }) => (p.isSeasonal ? (p.inSeason ? 'Teraz dostępny' : 'Poza sezonem') : '—')}
      />
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
      <InSeasonInput />

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
      <InSeasonInput />
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