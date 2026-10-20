import { useState } from 'react';
import { useNotify } from 'react-admin';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import type { Revision } from './revisions';

/**
 * „Wcześniejsze wersje”: lista 10 ostatnich wersji (stan sprzed kolejnych zapisów). Wybrana wersja trafia do
 * formularza bez zapisu – można ją przejrzeć i zapisać albo cofnąć.
 */
export function VersionHistory({
  load,
  revisions: loadRevisions,
  summary,
}: {
  /** pobranie listy wersji */
  revisions: () => Promise<Revision[]>;
  /** wczytanie wersji do formularza (label – opis do komunikatu, np. „wersję sprzed 20 października 14:30”) */
  load: (data: Record<string, unknown>, label: string) => void;
  /** krótki opis wersji na liście (np. tytuł) */
  summary: (data: Record<string, unknown>) => string;
}) {
  const notify = useNotify();
  const [open, setOpen] = useState(false);
  const [revisions, setRevisions] = useState<Revision[] | null>(null);

  const show = async () => {
    setOpen(true);
    setRevisions(null);
    try {
      setRevisions(await loadRevisions());
    } catch {
      notify('Nie udało się wczytać historii', { type: 'error' });
      setOpen(false);
    }
  };

  return (
    <>
      <Button color="inherit" startIcon={<HistoryIcon />} onClick={show}>
        Wcześniejsze wersje
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Wcześniejsze wersje</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Wybrana wersja zostanie wczytana do formularza – sprawdź ją i kliknij „Zapisz”. Dopóki tego nie zrobisz, na
            stronie nic się nie zmienia.
          </Typography>
          {revisions === null && <CircularProgress size={24} sx={{ mt: 2 }} />}
          {revisions?.length === 0 && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Brak wcześniejszych wersji – ta treść nie była jeszcze zmieniana.
            </Typography>
          )}
          {revisions && revisions.length > 0 && (
            <List dense>
              {revisions.map((r) => {
                const when = new Date(r.createdAt).toLocaleString('pl-PL', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <ListItem
                    key={r.id}
                    divider
                    secondaryAction={
                      <Button
                        size="small"
                        onClick={() => {
                          load(r.data, `wersję sprzed zmiany z ${when}`);
                          setOpen(false);
                        }}
                      >
                        Wczytaj
                      </Button>
                    }
                  >
                    <ListItemText
                      sx={{ pr: 10 }}
                      primary={summary(r.data) || '—'}
                      secondary={`Zastąpiona ${when}${r.createdBy ? ` · zmiana: ${r.createdBy}` : ''}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Zamknij</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
