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
  DateTimeInput,
  required,
  useRecordContext,
} from 'react-admin';
import { Alert, Chip, Stack } from '@mui/material';
import { useWatch } from 'react-hook-form';
import TagInput from '../common/TagInput';
import { NewsletterSaveToolbar } from '../common/NewsletterSaveToolbar';
import { useSubscriberCount } from '../common/useSubscriberCount';
import SortableImageInput from '../common/SortableImageInput';
import { ArticleProductTools } from '../common/ArticleProductTools';
import { SiteAddress } from '../common/SiteAddress';
import { ShareImageInput } from '../common/ShareImageInput';

interface NewsletterInfo {
  sendAsNewsletter?: boolean;
  newsletterSentAt?: string | null;
  newsletterRecipients?: number | null;
  publishAt?: string | null;
  isPublished?: boolean;
}

const formatWhen = (iso: string) =>
  new Date(iso).toLocaleString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

/** Termin publikacji w przyszłości (wpis i newsletter czekają) */
const isFuture = (value?: string | Date | null) => !!value && new Date(value).getTime() > Date.now();

/**
 * Planowanie: wpis pojawi się na stronie i (jeśli zaznaczono) zostanie wysłany jako newsletter o wybranej porze.
 * Po wysyłce newslettera terminu nie da się już zmienić.
 */
const ScheduleInput = () => {
  const record = useRecordContext<NewsletterInfo>();
  const [publishAt, published, send] = useWatch({ name: ['publishAt', 'isPublished', 'sendAsNewsletter'] }) as [
    string | null | undefined,
    boolean | undefined,
    boolean | undefined,
  ];
  if (record?.newsletterSentAt) return null;
  const what = [published !== false && 'pojawi się na stronie', send !== false && 'zostanie wysłany jako newsletter']
    .filter(Boolean)
    .join(' i ');
  return (
    <>
      <DateTimeInput
        source="publishAt"
        label="Zaplanuj publikację (opcjonalnie)"
        helperText="Puste – od razu po zapisie. Z datą: wpis czeka i sam się opublikuje o tej godzinie."
      />
      {isFuture(publishAt) && what && (
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          Zaplanowano: wpis {what} – {formatWhen(publishAt!)}. Do tego czasu możesz go dowolnie poprawiać.
        </Alert>
      )}
    </>
  );
};

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
  <List title="Aktualności i newsletter" sort={{ field: 'createdAt', order: 'DESC' }}>
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
        render={(r: NewsletterInfo) =>
          r.isPublished === false
            ? 'nie (tylko newsletter)'
            : isFuture(r.publishAt)
              ? `zaplanowany: ${formatWhen(r.publishAt!)}`
              : 'tak'
        }
      />
      <FunctionField
        label="Newsletter"
        render={(r: NewsletterInfo) =>
          r.newsletterSentAt
            ? r.newsletterRecipients == null
              ? 'wysyłanie…'
              : `wysłano (${r.newsletterRecipients} os.)`
            : r.sendAsNewsletter
              ? isFuture(r.publishAt)
                ? `zaplanowany: ${formatWhen(r.publishAt!)}`
                : 'czeka na wysyłkę'
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
      <ArticleProductTools />

      <TagInput />
      <PublishToggle />
      <NewsletterToggle />
      <ScheduleInput />

      <SortableImageInput source="images" maxQty={5} />
      <ShareImageInput />
    </SimpleForm>
  </Create>
);

export const BlogEdit = () => (
  <Edit>
    <SimpleForm toolbar={<NewsletterSaveToolbar deletable />}>
      <TextInput source="title" validate={[required()]} />
      <SiteAddress section="aktualnosci" />
      <TextInput source="shortDescription" multiline />
      <TextInput source="content" multiline minRows={6} helperText="Akapity oddziel pustą linią" />
      <ArticleProductTools />

      <TagInput />
      <PublishToggle />
      <NewsletterToggle />
      <ScheduleInput />

      <SortableImageInput source="images" maxQty={5} />
      <ShareImageInput />
    </SimpleForm>
  </Edit>
);
