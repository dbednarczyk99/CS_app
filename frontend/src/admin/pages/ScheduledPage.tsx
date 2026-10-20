import { useState } from 'react';
import { Title, useGetList } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, CardActionArea, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useSubscriberCount } from '../common/useSubscriberCount';
import { scheduledArticles, type ScheduledArticle } from '../common/scheduled';

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
const time = (iso: string) => new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

/** „za 3 dni”, „jutro”, „dziś” – ile zostało do publikacji */
function inDays(iso: string, now: number) {
  const startOf = (t: number) => new Date(new Date(t).toDateString()).getTime();
  const days = Math.round((startOf(new Date(iso).getTime()) - startOf(now)) / 86_400_000);
  return days <= 0 ? 'dziś' : days === 1 ? 'jutro' : `za ${days} dni`;
}

function ArticleCard({ a, subscribers, now }: { a: ScheduledArticle; subscribers: number | null | undefined; now: number }) {
  const navigate = useNavigate();
  const cover = a.images?.[0]?.src;
  const newsletter = a.sendAsNewsletter && !a.newsletterSentAt;
  return (
    <Card variant="outlined">
      <CardActionArea onClick={() => navigate(`/blog/${a.id}`)} sx={{ display: 'flex', alignItems: 'stretch', justifyContent: 'flex-start' }}>
        {cover && (
          <Box
            component="img"
            src={cover}
            alt=""
            sx={{ width: { xs: 88, sm: 140 }, objectFit: 'cover', flexShrink: 0, alignSelf: 'stretch' }}
          />
        )}
        <Box sx={{ p: 2, flex: 1, minWidth: 0 }}>
          <Typography variant="overline" color="primary" sx={{ lineHeight: 1.6 }}>
            {time(a.publishAt)} · {inDays(a.publishAt, now)}
          </Typography>
          <Typography variant="h6" sx={{ fontSize: '1.1rem', mt: 0.25 }}>
            {a.title}
          </Typography>
          {a.shortDescription && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {a.shortDescription}
            </Typography>
          )}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.25 }}>
            {a.isPublished ? (
              <Chip size="small" color="success" variant="outlined" label="Na stronie" />
            ) : (
              <Chip size="small" variant="outlined" label="Tylko newsletter" />
            )}
            {newsletter && (
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                label={`Newsletter${typeof subscribers === 'number' ? ` do ${subscribers} os.` : ''}`}
              />
            )}
            {a.tags?.map(({ tag }) => <Chip key={tag.id} size="small" label={tag.name} />)}
          </Stack>
        </Box>
        <Box sx={{ p: 2, display: { xs: 'none', sm: 'flex' }, alignItems: 'center', color: 'text.secondary' }}>
          <EditIcon fontSize="small" />
        </Box>
      </CardActionArea>
    </Card>
  );
}

/**
 * Marketing → Zaplanowane: wpisy i newslettery z ustawioną przyszłą datą publikacji (pole „Zaplanuj publikację”
 * we wpisie), pogrupowane według dnia. Kliknięcie otwiera edycję wpisu.
 */
export default function ScheduledPage() {
  const navigate = useNavigate();
  const subscribers = useSubscriberCount();
  const { data, isPending, error } = useGetList<ScheduledArticle>('blog', { pagination: { page: 1, perPage: 1000 } });
  // „teraz” ustalone przy wejściu na ekran (bez zmian przy każdym odświeżeniu widoku)
  const [now] = useState(() => Date.now());
  const items = scheduledArticles(data ?? [], now);
  // grupy według dnia publikacji
  const days = [...new Map(items.map((a) => [new Date(a.publishAt).toDateString(), a.publishAt])).values()];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: { xs: 2, md: 4 } }}>
      <Title title="Zaplanowane wpisy i newslettery" />
      <Stack direction="row" alignItems="flex-end" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5">Zaplanowane wpisy i newslettery</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Wpisy z datą w polu „Zaplanuj publikację” – pojawią się na stronie i (jeśli zaznaczono) trafią do
            subskrybentów automatycznie o podanej godzinie. Kliknij wpis, aby go zmienić albo przesunąć termin.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/blog/create')}>
          Nowy wpis
        </Button>
      </Stack>

      {isPending && <CircularProgress sx={{ mt: 4 }} />}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          Nie udało się wczytać wpisów – odśwież stronę.
        </Alert>
      )}
      {!isPending && !error && items.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Nic nie jest zaplanowane. Wpis lub newsletter zaplanujesz w „Aktualności i newsletter” → „Nowy wpis” → pole
          „Zaplanuj publikację”.
        </Alert>
      )}

      {days.map((day) => (
        <Box key={day} sx={{ mt: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, '&::first-letter': { textTransform: 'uppercase' } }}>
            {dayLabel(day)}
          </Typography>
          <Stack spacing={1.5}>
            {items
              .filter((a) => new Date(a.publishAt).toDateString() === new Date(day).toDateString())
              .map((a) => (
                <ArticleCard key={a.id} a={a} subscribers={subscribers} now={now} />
              ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}
