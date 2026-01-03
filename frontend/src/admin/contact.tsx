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
  { id: 'PHONE', name: 'Phone', icon: <ContactPhoneIcon fontSize="small" /> },
  { id: 'EMAIL', name: 'Email', icon: <AlternateEmailIcon fontSize="small" /> },
  { id: 'OTHER', name: 'Other', icon: <InfoIcon fontSize="small" /> },
];

const ContactTypeField = ({ source }: { source: string }) => {
  const record = useRecordContext<RaRecord>();
  if (!record) return null;

  const type = record[source] as string | undefined;
  const icon = (type && contactTypeIcons[type]) || null;

  return icon;
};

export const ContactInfoList = () => (
  <List>
    <Datagrid rowClick="edit">
      <ContactTypeField source="type" />
      <TextField source="value" />
      <TextField source="label" />
    </Datagrid>
  </List>
);

export const ContactInfoEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="value" label="Value" validate={[required()]} />
      <TextInput source="label" label="Label" validate={[required()]} />

      <SelectInput
        source="type"
        label="Type"
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
  <Create>
    <SimpleForm>
      <TextInput source="value" label="Value" validate={[required()]} />
      <TextInput source="label" label="Label" validate={[required()]} />
      <SelectInput
        source="type"
        label="Type"
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
