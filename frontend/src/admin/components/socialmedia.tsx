import {
  List,
  Datagrid,
  TextField,
  SimpleForm,
  TextInput,
  Edit,
  SelectInput,
  required,
  useGetList,
  Create,
  FunctionField,
} from 'react-admin';
import { FaFacebook, FaInstagram, FaPinterest, FaLinkedin, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6';

const mediaIconsAdmin: Record<string, React.ReactElement> = {
  FACEBOOK: <FaFacebook size={20} />,
  INSTAGRAM: <FaInstagram size={20} />,
  TWITTER: <FaXTwitter size={20} />,
  LINKEDIN: <FaLinkedin size={20} />,
  PINTEREST: <FaPinterest size={20} />,
  TIKTOK: <FaTiktok size={20} />,
  YOUTUBE: <FaYoutube size={20} />
};

const mediaChoices = [
  { id: 'FACEBOOK', name: 'Facebook' },
  { id: 'INSTAGRAM', name: 'Instagram' },
  { id: 'TWITTER', name: 'X (Twitter)' },
  { id: 'LINKEDIN', name: 'LinkedIn' },
  { id: 'PINTEREST', name: 'Pinterest' },
  { id: 'TIKTOK', name: 'TikTok' },
  { id: 'YOUTUBE', name: 'YouTube' },
];

const getMediaChoice = (id: string) =>
  mediaChoices.find(choice => choice.id === id);

export const MediaList = () => (
  <List>
    <Datagrid rowClick='edit'>
      <FunctionField
        label="Website"
        render={record => {
          const choice = getMediaChoice(record?.name);
          return (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {mediaIconsAdmin[record?.name as string]}
              {choice ? choice.name : record?.name}
            </span>
          );
        }}
      />
      <TextField source='url' />
    </Datagrid>
  </List>
);

export const MediaCreate = () => {
  const { data: mediaList } = useGetList('contact/media');
  const usedNames = mediaList?.map((item: { name: string }) => item.name) || [];

  // Dodaj disabled: true dla już istniejących
  const availableChoices = mediaChoices.map(choice => ({
    ...choice,
    disabled: usedNames.includes(choice.id),
  }));

  return (
    <Create>
      <SimpleForm>
        <SelectInput
          source="name"
          label="Medium"
          choices={availableChoices}
          validate={[required()]}
          optionText={(choice: { id: string; name: string; disabled?: boolean }) => (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: choice.disabled ? '#aaa' : undefined }}>
              {mediaIconsAdmin[choice.id]} {choice.name}
            </span>
          )}
          optionValue="id"
        />
        <TextInput source="url" label="URL" validate={[required()]} fullWidth />
      </SimpleForm>
    </Create>
  );
};

export const MediaEdit = () => (
  <Edit>
    <SimpleForm>
      <SelectInput
        source="name"
        label="Medium"
        choices={mediaChoices}
        validate={[required()]}
        optionText={choice => (
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {mediaIconsAdmin[choice.id]} {choice.name}
          </span>
        )}
        optionValue="id"
        disabled // nie pozwalaj zmieniać platformy przy edycji
      />
      <TextInput source="url" label="URL" validate={[required()]} fullWidth />
    </SimpleForm>
  </Edit>
);