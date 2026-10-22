import type { FC } from 'react';
import { FormUnsavedChanges } from '../common/UnsavedChanges';
import { MobileList } from '../common/MobileList';
// admin/components/breadVan.tsx

import {
  Show,
  Edit,
  SimpleShowLayout,
  SimpleForm,
  TextInput,
  RichTextField,
  ArrayField,
  SingleFieldList,
  ImageField,
  List,
  Datagrid,
  TextField,
  required,
  minLength,
  maxLength,
  useRecordContext,
  Create,
  SelectInput,
  BooleanInput,
  DeleteWithConfirmButton,
  SaveButton,
  Toolbar,
  useNotify,
  useRefresh,
  useUpdate,
  type RaRecord,
} from 'react-admin';
import { Alert, Box, Button, Chip, Tab, Tabs } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useLocation, useNavigate } from 'react-router-dom';
import { CoordinatesInput } from '../common/CoordinatesInput';
import { ImagePreview } from '../common/ImagePreview';
import SortableImageInput from '../common/SortableImageInput';
import { weekdayName, weekdayOption } from '../common/weekdays';

/** Jeden ekran „Chlebowóz” w menu: zakładki Trasa | Opis i zdjęcia (dwa zasoby API pod spodem) */
const BreadVanTabs = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const value = pathname.startsWith('/bread-van/description') ? '/bread-van/description/view/show' : '/bread-van/locations';
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
      <Tabs value={value} onChange={(_, to: string) => navigate(to)}>
        <Tab label="Trasa" value="/bread-van/locations" />
        <Tab label="Opis i zdjęcia" value="/bread-van/description/view/show" />
      </Tabs>
    </Box>
  );
};

export const BreadVanDescriptionShow = () => (
  <>
  <BreadVanTabs />
  <Show resource="bread-van/description" id="singleton" title="Chlebowóz">
    <SimpleShowLayout>
      <RichTextField source="shortDescription" />
      <RichTextField source="longDescription" />

      <ArrayField source="images">
        <SingleFieldList linkType={false}>
          <ImagePreview>
            <ImageField source="imgUrl" />
          </ImagePreview>
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
  </>
);

export const BreadVanDescriptionEdit = () => (
  <Edit resource="bread-van/description" id="singleton" title="Chlebowóz – edycja opisu">
    <SimpleForm>
      <FormUnsavedChanges />
      <TextInput
        source="shortDescription"
        fullWidth
        multiline
        validate={[required(), minLength(20), maxLength(60)]}
        helperText="20–60 znaków"
      />
      <TextInput
        source="longDescription"
        fullWidth
        multiline
        validate={[required(), minLength(200), maxLength(500)]}
        helperText="200–500 znaków"
      />
      <SortableImageInput source="images" validate={true} maxQty={5} />
    </SimpleForm>
  </Edit>
);

const WeekdayTextField = ({ source }: { source: string; label?: string }) => {
  const record = useRecordContext<RaRecord>();
  if (!record) return null;
  return <span>{weekdayName(record[source] as string)}</span>;
};

type Stop = RaRecord & { isActive?: boolean; address: string };
/** „label” czyta Datagrid (nagłówek kolumny) */
type ColumnProps = { label?: string };

/** Przycisk „Ukryj / Pokaż” na liście – zmiana widoczności bez otwierania formularza */
const VisibilityToggle: FC<ColumnProps> = () => {
  const record = useRecordContext<Stop>();
  const [update, { isPending }] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();
  if (!record) return null;
  const visible = record.isActive !== false;
  return (
    <Button
      size="small"
      color={visible ? 'inherit' : 'primary'}
      startIcon={visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
      disabled={isPending}
      onClick={(e) => {
        e.stopPropagation();
        update(
          'bread-van/locations',
          { id: record.id, data: { isActive: !visible }, previousData: record },
          {
            mutationMode: 'pessimistic',
            onSuccess: () => {
              notify(visible ? 'Przystanek ukryty – zniknął ze strony, zostaje na liście' : 'Przystanek znów widoczny na stronie', { type: 'success' });
              refresh();
            },
            onError: (error) => notify((error as Error).message || 'Nie udało się zmienić widoczności', { type: 'error' }),
          },
        );
      }}
    >
      {visible ? 'Ukryj' : 'Pokaż'}
    </Button>
  );
};

const VisibilityChip: FC<ColumnProps> = () => {
  const record = useRecordContext<Stop>();
  if (!record) return null;
  return record.isActive === false ? (
    <Chip size="small" label="Ukryty" variant="outlined" />
  ) : (
    <Chip size="small" label="Na stronie" color="success" variant="outlined" />
  );
};

const scheduleFilters = [
  <SelectInput
    key="widocznosc"
    source="isActive"
    label="Widoczność"
    choices={[
      { id: true, name: 'Na stronie' },
      { id: false, name: 'Ukryte' },
    ]}
    alwaysOn
  />,
];

export const BreadVanScheduleList = () => (
  <>
  <BreadVanTabs />
  <List resource="bread-van/locations" title="Chlebowóz" pagination={false} filters={scheduleFilters}>
    <Box sx={{ px: 2, pt: 2 }}>
      <Alert severity="info" variant="outlined">
        Jednego dnia może być kilka przystanków – widoczne nie mogą nakładać się godzinami. Gdy trasa się zmienia,
        stare przystanki <strong>ukryj</strong> zamiast je usuwać: znikną ze strony i z rezerwacji, ale zostaną na liście,
        żeby można je było później przywrócić jednym kliknięciem. Dzień bez widocznych przystanków jest na stronie oznaczony
        „Chlebowóz odpoczywa”.
      </Alert>
    </Box>
    <MobileList
      primaryText={(s) => s.address}
      secondaryText={(s) =>
        `${weekdayName(s.dayOfTheWeek)} · ${s.startTime}–${s.endTime}${s.isActive === false ? ' · ukryty' : ''}`
      }
      tertiaryText={() => <VisibilityToggle />}
      rowClick="edit"
    >
    <Datagrid
      rowClick="edit"
      bulkActionButtons={false}
      // ukryty przystanek przyciemniony – poza przyciskiem „Pokaż”, który ma wyglądać na aktywny
      rowSx={(record) => ({ '& td:not(:last-of-type)': { opacity: record.isActive === false ? 0.55 : 1 } })}
    >
      <WeekdayTextField source="dayOfTheWeek" label="Dzień tygodnia" />
      <TextField source="startTime" />
      <TextField source="endTime" />
      <TextField source="address" />
      <VisibilityChip label="Widoczność" />
      <VisibilityToggle label="" />
    </Datagrid>
    </MobileList>
  </List>
  </>
);

/** Zapis + usuwanie z ostrzeżeniem (lepiej ukryć – trasa może wrócić) */
const ScheduleToolbar = () => {
  const record = useRecordContext<Stop>();
  return (
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <SaveButton />
      {record?.id && (
        <DeleteWithConfirmButton
          confirmTitle="Usunąć przystanek na stałe?"
          confirmContent="Jeśli chlebowóz może tu kiedyś wrócić, lepiej wyłącz „Pokazuj na stronie” – przystanek zniknie ze strony i z rezerwacji, ale zostanie w panelu. Usunięcia nie da się cofnąć."
        />
      )}
    </Toolbar>
  );
};

const ScheduleForm = () => (
  <SimpleForm toolbar={<ScheduleToolbar />}>
    <FormUnsavedChanges />
    <BooleanInput
      source="isActive"
      label="Pokazuj na stronie"
      defaultValue={true}
      helperText="Wyłączony – przystanek nie pojawia się na stronie ani w rezerwacjach, ale zostaje tutaj na później"
    />
    <SelectInput
      source="dayOfTheWeek"
      choices={weekdayOption}
      optionValue="id"
      optionText="text"
      validate={[required()]}
    />
    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextInput source="startTime" type="time" validate={[required()]} InputLabelProps={{ shrink: true }} />
      <TextInput source="endTime" type="time" validate={[required()]} InputLabelProps={{ shrink: true }} />
    </Box>

    <TextInput source="address" validate={[required()]} helperText="np. „Plac Inwalidów, Kraków” – tak wyświetli się na stronie" />
    <TextInput source="googleMapsUrl" validate={[required()]} />
    <CoordinatesInput />
  </SimpleForm>
);

export const BreadVanScheduleCreate = () => (
  <Create resource="bread-van/locations" title="Nowy przystanek" redirect="list">
    <ScheduleForm />
  </Create>
);

export const BreadVanScheduleEdit = () => (
  <Edit resource="bread-van/locations" redirect="list">
    <ScheduleForm />
  </Edit>
);
