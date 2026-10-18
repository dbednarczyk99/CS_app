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
  useRecordContext,
} from 'react-admin';
import { Alert, Chip, Stack } from '@mui/material';
import { useWatch } from 'react-hook-form';
import TagInput from '../common/TagInput';
import { NewsletterSaveToolbar } from '../common/NewsletterSaveToolbar';
import { useSubscriberCount } from '../common/useSubscriberCount';
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
  const confirmed = useSubscriberCount() ?? '…';

  if (record?.newsletterSentAt) {
    return (
      <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
        Wysłano jako newsletter {new Date(record.newsletterSentAt).toLocaleString('pl-PL')}
        {record.newsletterRecipients == null ? ' (wysyłanie w toku)' : ` do ${record.newsletterRecipients} os.`}. Poprawki w
        treści nie wysyłają go ponownie.
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

/** Publikacja na stronie – wyłączona = wpis tylko do newslettera (albo szkic, gdy bez wysyłki) */
const PublishToggle = () => {
  const [published, send] = useWatch({ name: ['isPublished', 'sendAsNewsletter'] }) as [boolean | undefined, boolean | undefined];
  return (
    <>
      <BooleanInput
        source="isPublished"
        label="Opublikuj na stronie"
        defaultValue={true}
        helperText="Wyłącz, aby wysłać wpis tylko jako newsletter – nie pojawi się w Aktualnościach, a subskrybenci dostaną w e-mailu całą treść."
      />
      {published === false && send === false && (
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          Wpis bez publikacji i bez wysyłki to szkic – nikt go nie zobaczy, dopóki nie włączysz jednej z opcji.
        </Alert>
      )}
    </>
  );
};

export const BlogList = () => (
  <List title="Aktualności (blog)" sort={{ field: 'createdAt', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="title" label="Tytuł" />
      <TextField source="shortDescription" label="Zajawka" />

      {/* tagi są we wpisie jako relacja { tag: { name } } */}
      <FunctionField
        label="Tagi"
        render={(record: { tags?: { tag: { id: string; name: string } }[] }) => (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {(record.tags ?? []).map(({ tag }) => (
              <Chip key={tag.id} label={tag.name} size="small" />
            ))}
          </Stack>
        )}
      />

      <DateField source="createdAt" label="Dodano" locales="pl-PL" />
      <FunctionField
        label="Na stronie"
        render={(r: { isPublished?: boolean }) => (r.isPublished === false ? 'nie (tylko newsletter)' : 'tak')}
      />
      <FunctionField
        label="Newsletter"
        render={(r: NewsletterInfo) =>
          r.newsletterSentAt
            ? r.newsletterRecipients == null
              ? 'wysyłanie…'
              : `wysłano (${r.newsletterRecipients} os.)`
            : r.sendAsNewsletter
              ? 'czeka na wysyłkę'
              : '—'
        }
      />
    </Datagrid>
  </List>
);

export const BlogCreate = () => (
  <Create title="Nowy wpis">
    <SimpleForm toolbar={<NewsletterSaveToolbar />}>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="shortDescription" multiline />
      <TextInput source="content" multiline minRows={6} helperText="Akapity oddziel pustą linią" />

      <TagInput />
      <PublishToggle />
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
      <TextInput source="content" multiline minRows={6} helperText="Akapity oddziel pustą linią" />

      <TagInput />
      <PublishToggle />
      <NewsletterToggle />

      <SortableImageInput source="images" maxQty={5} />
    </SimpleForm>
  </Edit>
);
