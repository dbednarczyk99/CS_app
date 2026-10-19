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
  ReferenceArrayInput,
  CheckboxGroupInput,
  DateInput,
} from 'react-admin';
import { Box, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';
import SortableImageInput from '../common/SortableImageInput';
import { LabelChip } from './labels';

type ProductRecord = {
  price: number;
  isSeasonal: boolean;
  inSeason: boolean;
  labels?: { id: string; name: string; color: string }[];
  isPromo: boolean;
  promoPrice: number | null;
  promoFrom: string | null;
  promoTo: string | null;
};

/** Dzisiejsza data w Polsce (YYYY-MM-DD) – do opisu stanu promocji */
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw' }).format(new Date());
const formatDay = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
const formatPrice = (value: number) => `${value.toFixed(2).replace('.', ',')} zł`;

/** Stan promocji słownie: trwa / zaplanowana / zakończona (null – promocja wyłączona) */
const promoState = (p: Pick<ProductRecord, 'isPromo' | 'promoFrom' | 'promoTo'>) => {
  if (!p.isPromo) return null;
  const now = today();
  if (p.promoFrom && p.promoFrom > now) return { text: `zaplanowana od ${formatDay(p.promoFrom)}`, color: 'info.main' };
  if (p.promoTo && p.promoTo < now) return { text: `zakończona ${formatDay(p.promoTo)}`, color: 'text.disabled' };
  return { text: p.promoTo ? `trwa do ${formatDay(p.promoTo)}` : 'trwa (bez daty końca)', color: 'success.main' };
};

const SectionTitle = ({ children }: { children: string }) => (
  <Typography variant="overline" color="primary" sx={{ mt: 2, display: 'block' }}>
    {children}
  </Typography>
);

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

/** Etykiety widoczne na karcie produktu na stronie – lista w zakładce „Etykiety” */
const LabelInputs = () => (
  <>
    <SectionTitle>Etykiety</SectionTitle>
    <ReferenceArrayInput
      source="labelIds"
      reference="products/labels"
      filter={{ assignable: true }}
      sort={{ field: 'order', order: 'ASC' }}
      perPage={100}
    >
      <CheckboxGroupInput
        label={false}
        optionText={(l: { name: string; color: string }) => <LabelChip name={l.name} color={l.color} />}
        helperText="Produkty z etykietą są pokazywane w pierwszej kolejności na stronie głównej. Nową etykietę dodasz w zakładce Oferta → Etykiety."
      />
    </ReferenceArrayInput>
  </>
);

// walidacja promocji (to samo sprawdza serwer)
const lowerThanPrice = (value: number | null, all: { price?: number }) =>
  value != null && all.price != null && value >= all.price ? 'Cena promocyjna musi być niższa od zwykłej' : undefined;
const notBeforeStart = (value: string | null, all: { promoFrom?: string | null }) =>
  value && all.promoFrom && value < all.promoFrom ? 'Koniec nie może być przed początkiem' : undefined;

/** Promocja: etykieta „Promocja”, opcjonalnie niższa cena, okres od–do */
const PromoInputs = () => {
  const values = useWatch() as ProductRecord;
  const state = promoState(values);
  const lowersPrice = values.promoPrice != null && values.price != null && values.promoPrice < values.price;
  return (
    <>
      <SectionTitle>Promocja</SectionTitle>
      <BooleanInput
        source="isPromo"
        label="Promocja"
        defaultValue={false}
        helperText="Etykieta promocji na stronie i filtr w ofercie – w wybranym okresie (nazwę i kolor etykiety zmienisz w Oferta → Etykiety)"
      />
      {values.isPromo && (
        <>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <NumberInput
              source="promoPrice"
              label="Cena promocyjna (zł)"
              validate={lowerThanPrice}
              helperText="Opcjonalnie – puste: tylko etykieta, bez zmiany ceny"
            />
            <DateInput source="promoFrom" label="Od" helperText="Puste – od razu" />
            <DateInput source="promoTo" label="Do (włącznie)" validate={notBeforeStart} helperText="Puste – bez końca" />
          </Box>
          {state && (
            <Typography variant="body2" sx={{ color: state.color, mb: 1 }}>
              Promocja {state.text}.
              {lowersPrice && ' Na stronie stara cena będzie przekreślona. Rezerwacje z odbiorem w tym okresie – po cenie promocyjnej (liczy się dzień odbioru, nie złożenia rezerwacji).'}
            </Typography>
          )}
        </>
      )}
    </>
  );
};

export const ProductList = () => (
  <List title="Produkty">
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <NumberField source="price" locales="pl-PL" options={{ style: "currency", currency: "PLN" }} />
      <TextField source="description" />
      <TextField source="category.name" label="Kategoria" />

      <FunctionField
        label="Sezon"
        render={(p: { isSeasonal: boolean; inSeason: boolean }) => (p.isSeasonal ? (p.inSeason ? 'Teraz dostępny' : 'Poza sezonem') : '—')}
      />
      <FunctionField
        label="Etykiety"
        render={(p: ProductRecord) =>
          p.labels?.length ? (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {p.labels.map((l) => (
                <LabelChip key={l.id} name={l.name} color={l.color} />
              ))}
            </Box>
          ) : (
            '—'
          )
        }
      />
      <FunctionField
        label="Promocja"
        render={(p: ProductRecord) => {
          const state = promoState(p);
          if (!state) return '—';
          return (
            <Typography variant="body2" sx={{ color: state.color }}>
              {p.promoPrice != null && `${formatPrice(p.promoPrice)}, `}
              {state.text}
            </Typography>
          );
        }}
      />
      <BooleanField source="isActive" />
      <BooleanField source="isReservable" label="Rezerwacja" />
    </Datagrid>
  </List>
);

export const ProductCreate = () => (
  <Create title="Nowy produkt">
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <NumberInput source="price" validate={[required()]} />
      <TextInput source="description" validate={[required()]} multiline />

      <BooleanInput
        source="isSeasonal"
        label="Produkt sezonowy"
        defaultValue={false}
        validate={[required()]}
      />
      <InSeasonInput />
      <LabelInputs />
      <PromoInputs />

      <BooleanInput
        source="isActive"
        label="Aktywny – widoczny na stronie"
        defaultValue={true}
        validate={[required()]}
      />

      <BooleanInput
        source="isReservable"
        label="Można rezerwować online"
        defaultValue={true}
      />

      <ReferenceInput
        label="Kategoria"
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
      <TextInput source="description" validate={[required()]} multiline />
      <BooleanInput source="isSeasonal" label="Produkt sezonowy" />
      <InSeasonInput />
      <LabelInputs />
      <PromoInputs />
      <BooleanInput source="isActive" label="Aktywny – widoczny na stronie" />
      <BooleanInput source="isReservable" label="Można rezerwować online" />

      <ReferenceInput
        label="Kategoria"
        source="categoryId"
        reference="products/categories"
      >
        <SelectInput optionText="name" validate={[required()]} />
      </ReferenceInput>

      <SortableImageInput source="images" validate={true} maxQty={3} />
    </SimpleForm>
  </Edit>
);
