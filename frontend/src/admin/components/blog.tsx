import {
  List,
  Datagrid,
  TextField,
  Create,
  Edit,
  DateField,
  FunctionField,
  SimpleForm,
  TextInput,
  BooleanInput,
  required,
  useGetList,
  useRecordContext,
} from 'react-admin';
import { Alert, Chip, Stack } from '@mui/material';
import TagInput from '../common/TagInput';
import { NewsletterSaveToolbar } from '../common/NewsletterSaveToolbar';
import SortableImageInput from '../common/SortableImageInput';

interface NewsletterInfo {
  sendAsNewsletter?: boolean;
  newsletterSentAt?: string | null;
  newsletterRecipients?: number | null;
}

/**
 * Wysyłka wpisu do newslettera: przełącznik (domyślnie włączony) albo – gdy już wysłano – informacja
 * kiedy i do ilu osób (wpis wysyła się tylko raz, poprawki nie wysyłają go ponownie).
 */
const NewsletterToggle = () => {
  const record = useRecordContext<NewsletterInfo>();
  const { data: subscribers = [] } = useGetList<{ id: string; status: string }>('newsletter', {
    pagination: { page: 1, perPage: 1000 },
  });
  const confirmed = subscribers.filter((s) => s.status === 'CONFIRMED').length;

  if (record?.newsletterSentAt) {
    return (
      <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
        Wysłano jako newsletter {new Date(record.newsletterSentAt).toLocaleString('pl-PL')} do{' '}
        {record.newsletterRecipients ?? 0} os. Poprawki w treści nie wysyłają go ponownie.
      </Alert>
    );
  }
  return (
    <BooleanInput
      source="sendAsNewsletter"
      label="Wyślij jako newsletter"
      defaultValue={true}
      helperText={`Po zapisaniu wpis trafi e-mailem do potwierdzonych subskrybentów (obecnie: ${confirmed}) – tylko raz. Wyłącz dla wpisów, których nie chcesz wysyłać.`}
    />
  );
};

export const BlogList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="title" label="Title" />
      <TextField source="shortDescription" label="Short description" />

      {/* tagi są we wpisie jako relacja { tag: { name } } */}
      <FunctionField
        label="Tags"
        render={(record: { tags?: { tag: { id: string; name: string } }[] }) => (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {(record.tags ?? []).map(({ tag }) => (
              <Chip key={tag.id} label={tag.name} size="small" />
            ))}
          </Stack>
        )}
      />

      <DateField source="createdAt" />
      <FunctionField
        label="Newsletter"
        render={(r: NewsletterInfo) =>
          r.newsletterSentAt
            ? `wysłano (${r.newsletterRecipients ?? 0} os.)`
            : r.sendAsNewsletter
              ? 'czeka na wysyłkę'
              : '—'
        }
      />
    </Datagrid>
  </List>
);

export const BlogCreate = () => (
  <Create>
    <SimpleForm toolbar={<NewsletterSaveToolbar />}>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="shortDescription" multiline />
      <TextInput source="content" multiline />

      <TagInput />
      <NewsletterToggle />

      <SortableImageInput source="images" maxQty={5} />
    </SimpleForm>
  </Create>
);

export const BlogEdit = () => (
  <Edit>
    <SimpleForm toolbar={<NewsletterSaveToolbar deletable />}>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="shortDescription" multiline />
      <TextInput source="content" multiline />

      <TagInput />
      <NewsletterToggle />

      <SortableImageInput source="images" maxQty={5} />
    </SimpleForm>
  </Edit>
);
