import {
  Create,
  Datagrid,
  DateField,
  DeleteWithConfirmButton,
  Edit,
  FunctionField,
  List,
  PasswordInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  Toolbar,
  maxLength,
  minLength,
  regex,
  required,
  useGetIdentity,
  useRecordContext,
} from 'react-admin';
import { Alert, Box, Chip } from '@mui/material';

/* Konta panelu – tylko administrator. Dwie role: administrator (wszystko) i marketing (bez rezerwacji i ustawień). */

const ROLE_CHOICES = [
  { id: 'ADMIN', name: 'Administrator – pełny dostęp' },
  { id: 'EDITOR', name: 'Marketing' },
];

const roleLabel = (role: string) => ({ ADMIN: 'Administrator', EDITOR: 'Marketing' })[role] ?? role;

interface UserRecord {
  id: string;
  login: string;
  name: string | null;
  role: string;
  createdAt: string;
}

const passwordRules = [minLength(10, 'Co najmniej 10 znaków')];

const RolesInfo = () => (
  <Alert severity="info" variant="outlined" sx={{ mb: 2, width: '100%' }}>
    <strong>Administrator</strong> ma dostęp do wszystkiego, w tym rezerwacji z danymi klientów, zasad rezerwacji,
    dokumentów prawnych i kont. <strong>Marketing</strong> – produkty, piekarnie, chlebowóz, treści strony, aktualności i newsletter, subskrybenci, baner i media społecznościowe; bez rezerwacji, kosztów i ustawień.
  </Alert>
);

export const UserList = () => {
  const { identity } = useGetIdentity();
  return (
    <List title="Konta" pagination={false} exporter={false}>
      <Box sx={{ px: 2, pt: 2 }}>
        <RolesInfo />
      </Box>
      <Datagrid rowClick="edit" bulkActionButtons={false}>
        <FunctionField
          label="Osoba"
          render={(u: UserRecord) => (
            <>
              {u.name || u.login}
              {u.id === identity?.id && <Chip size="small" label="to Ty" sx={{ ml: 1 }} />}
            </>
          )}
        />
        <TextField source="login" label="Login" />
        <FunctionField
          label="Rola"
          render={(u: UserRecord) => (
            <Chip
              size="small"
              label={roleLabel(u.role)}
              color={u.role === 'ADMIN' ? 'primary' : 'default'}
              variant="outlined"
            />
          )}
        />
        <DateField source="createdAt" label="Utworzone" locales="pl-PL" />
      </Datagrid>
    </List>
  );
};

export const UserCreate = () => (
  <Create title="Nowe konto" redirect="list">
    <SimpleForm>
      <RolesInfo />
      <TextInput
        source="login"
        label="Login"
        validate={[
          required(),
          regex(/^[a-z0-9._-]{3,30}$/, '3–30 znaków: małe litery bez polskich znaków, cyfry, kropka, myślnik'),
        ]}
        helperText="Np. „anna” lub „social.media” – tym loginem osoba będzie się logować"
      />
      <TextInput
        source="name"
        label="Nazwa wyświetlana"
        validate={maxLength(60)}
        helperText="Np. imię – widoczna w panelu"
      />
      <SelectInput source="role" label="Rola" choices={ROLE_CHOICES} defaultValue="EDITOR" validate={required()} />
      <PasswordInput
        source="password"
        label="Hasło startowe"
        autoComplete="new-password"
        validate={[required(), ...passwordRules]}
        helperText="Co najmniej 10 znaków. Przekaż je osobie osobiście – po zalogowaniu zmieni je w „Moje konto”."
      />
    </SimpleForm>
  </Create>
);

/** Usuwanie tylko cudzych kont (własnego nie można – serwer też tego pilnuje) */
const EditToolbar = () => {
  const record = useRecordContext<UserRecord>();
  const { identity } = useGetIdentity();
  return (
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <SaveButton />
      {record && record.id !== identity?.id && (
        <DeleteWithConfirmButton
          confirmTitle="Usunąć konto?"
          confirmContent="Osoba straci dostęp do panelu od razu. Tej operacji nie można cofnąć."
        />
      )}
    </Toolbar>
  );
};

const RoleInput = () => {
  const record = useRecordContext<UserRecord>();
  const { identity } = useGetIdentity();
  const self = record?.id === identity?.id;
  return (
    <SelectInput
      source="role"
      label="Rola"
      choices={ROLE_CHOICES}
      validate={required()}
      disabled={self}
      helperText={self ? 'Własnej roli nie można zmienić' : false}
    />
  );
};

export const UserEdit = () => (
  <Edit redirect="list" mutationMode="pessimistic">
    <SimpleForm toolbar={<EditToolbar />}>
      <TextInput source="login" label="Login" disabled helperText="Loginu nie można zmienić" />
      <TextInput source="name" label="Nazwa wyświetlana" validate={maxLength(60)} />
      <RoleInput />
      <PasswordInput
        source="password"
        label="Nowe hasło"
        autoComplete="new-password"
        validate={passwordRules}
        helperText="Zostaw puste, aby nie zmieniać. Po ustawieniu nowego hasła osoba zostanie wylogowana na wszystkich urządzeniach."
      />
    </SimpleForm>
  </Edit>
);
