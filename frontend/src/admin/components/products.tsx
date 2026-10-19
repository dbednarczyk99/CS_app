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
  DateTimeInput,
} from 'react-admin';
import { useState } from 'react';
import { Alert, Box, Typography } from '@mui/material';
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
  isActive?: boolean;
  availableFrom?: string | null;
  unavailableFrom?: string | null;
};

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

/** Zaplanowane zmiany dostępności słownie (dla formularza i listy) */
const scheduleTexts = (p: ProductRecord, now: number) => {
  const texts: { text: string; short: string; at: number; warn?: boolean }[] = [];
  const on = p.availableFrom ? new Date(p.availableFrom).getTime() : 0;
  const off = p.unavailableFrom ? new Date(p.unavailableFrom).getTime() : 0;
  if (on > now) {
    // „już dostępny” tylko wtedy, gdy wcześniej nic go nie wyłączy (np. koniec sezonu przed powrotem)
    const already = p.isActive !== false && (!p.isSeasonal || p.inSeason) && !(off > now && off < on);
    texts.push(
      already
        ? {
            text: `Produkt już jest dostępny – data „Dostępny od” (${formatWhen(p.availableFrom!)}) niczego nie zmieni.`,
            short: 'dostępny (już jest)',
            at: on,
            warn: true,
          }
        : {
            text: p.isSeasonal
              ? `${formatWhen(p.availableFrom!)} – wróci do sprzedaży („Teraz dostępne”, rezerwacje online).`
              : `${formatWhen(p.availableFrom!)} – pojawi się w ofercie na stronie.`,
            short: 'dostępny',
            at: on,
          },
    );
  }
  if (off > now) {
    texts.push({
      text: p.isSeasonal
        ? `${formatWhen(p.unavailableFrom!)} – przejdzie do „Wrócą w sezonie” (bez ceny i rezerwacji).`
        : `${formatWhen(p.unavailableFrom!)} – zniknie z oferty na stronie.`,
      short: p.isSeasonal ? 'poza sezonem' : 'ukryty',
      at: off,
    });
  }
  return texts.sort((a, b) => a.at - b.at);
};

const shortWhen = (at: number) =>
  new Date(at).toLocaleString('pl-PL', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });

/** Kolumna listy „Zaplanowane”: najbliższe zmiany dostępności */
const ScheduleCell = ({ product }: { product: ProductRecord }) => {
  const [now] = useState(() => Date.now());
  const texts = scheduleTexts(product, now);
  if (texts.length === 0) return <>—</>;
  return (
    <Typography variant="body2" sx={{ color: 'info.main' }}>
      {texts.map((t) => `${shortWhen(t.at)}: ${t.short}`).join('; ')}
    </Typography>
  );
};

/**
 * Planowanie dostępności: o wybranej porze serwer sam przestawi przełącznik „Aktywny” / „W sezonie”
 * (np. nowy produkt pojawi się w piątek o 6:00, choć nikt nie będzie wtedy przy komputerze).
 */
const ScheduleInputs = () => {
  const values = useWatch() as ProductRecord;
  const [now] = useState(() => Date.now());
  const texts = scheduleTexts(values, now);
  return (
    <>
      <SectionTitle>Planowanie</SectionTitle>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <DateTimeInput
          source="availableFrom"
          label="Dostępny od (opcjonalnie)"
          helperText="O tej porze produkt sam się włączy – nowy pojawi się w ofercie, sezonowy wróci do sprzedaży"
        />
        <DateTimeInput
          source="unavailableFrom"
          label="Niedostępny od (opcjonalnie)"
          helperText="O tej porze sezonowy przejdzie do „Wrócą w sezonie”, zwykły zniknie z oferty"
        />
      </Box>
      {texts.length > 0 && (
        <Alert severity={texts.some((t) => t.warn) ? 'warning' : 'info'} sx={{ mb: 2 }}>
          {texts.map((t) => (
            <div key={t.text}>Zaplanowano: {t.text}</div>
          ))}
          <div style={{ marginTop: 4, opacity: 0.8 }}>
            Ręczna zmiana przełączników działa od razu; zaplanowana wykona się o swojej porze (usuń datę, aby ją odwołać).
          </div>
        </Alert>
      )}
    </>
  );
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
      <FunctionField
        label="Zaplanowane"
        render={(p: ProductRecord) => <ScheduleCell product={p} />}
      />
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
      <ScheduleInputs />

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
      <ScheduleInputs />

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
