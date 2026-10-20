import { ScreenTabs } from '../common/ScreenTabs';
import { CONTACT_TABS } from '../common/screen-tabs';
import {
  List,
  Datagrid,
  TextField,
  SimpleForm,
  TextInput,
  Edit,
  SelectInput,
  required,
  useRecordContext,
  type RaRecord,
  Create,
} from 'react-admin';
import type { ReactElement } from 'react';

import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import InfoIcon from '@mui/icons-material/Info';

const contactTypeIcons: Record<string, ReactElement> = {
  PHONE: <ContactPhoneIcon fontSize="small" />,
  EMAIL: <AlternateEmailIcon fontSize="small" />,
  OTHER: <InfoIcon fontSize="small" />,
};

const contactTypeChoices = [
  { id: 'PHONE', name: 'Telefon', icon: <ContactPhoneIcon fontSize="small" /> },
  { id: 'EMAIL', name: 'E-mail', icon: <AlternateEmailIcon fontSize="small" /> },
  { id: 'OTHER', name: 'Inne', icon: <InfoIcon fontSize="small" /> },
];

const ContactTypeField = ({ source }: { source: string; label?: string }) => {
  const record = useRecordContext<RaRecord>();
  if (!record) return null;

  const type = record[source] as string | undefined;
  const icon = (type && contactTypeIcons[type]) || null;

  return icon;
};

export const ContactInfoList = () => (
  <>
  <ScreenTabs tabs={CONTACT_TABS} />
  <List title="Dane kontaktowe">
    <Datagrid rowClick="edit">
      <ContactTypeField source="type" label="Rodzaj" />
      <TextField source="value" />
      <TextField source="label" />
    </Datagrid>
  </List>
  </>
);

export const ContactInfoEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="value" label="Wartość (numer, adres e-mail…)" validate={[required()]} />
      <TextInput source="label" label="Opis (np. „Biuro”, „Zamówienia”)" validate={[required()]} />

      <SelectInput
        source="type"
        label="Rodzaj"
        validate={[required()]}
        choices={contactTypeChoices}
        optionValue="id"
        optionText={(choice) =>
          choice
            ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {choice.icon}
                  {choice.name}
                </span>
              )
            : ''
        }
      />
    </SimpleForm>
  </Edit>
);

export const ContactInfoCreate = () => (
  <Create title="Nowe dane kontaktowe">
    <SimpleForm>
      <TextInput source="value" label="Wartość (numer, adres e-mail…)" validate={[required()]} />
      <TextInput source="label" label="Opis (np. „Biuro”, „Zamówienia”)" validate={[required()]} />
      <SelectInput
        source="type"
        label="Rodzaj"
        validate={[required()]}
        choices={contactTypeChoices}
        optionValue="id"
        optionText={(choice) =>
          choice
            ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {choice.icon}
                  {choice.name}
                </span>
              )
            : ''
        }
      />
    </SimpleForm>
  </Create>
);
