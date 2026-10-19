import { useState } from 'react';
import { DeleteButton, SaveButton, Toolbar, useRecordContext, useSaveContext } from 'react-admin';
import { useSubscriberCount } from './useSubscriberCount';
import { useFormContext, useWatch } from 'react-hook-form';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * Pasek zapisu wpisu na blogu: gdy wpis ma zostać wysłany jako newsletter, „Save” najpierw pokazuje
 * potwierdzenie – w rogu ekranu, bez przyciemnienia, żeby można było jeszcze przejrzeć formularz.
 * Wysłanej wiadomości nie da się już zmienić (poprawki we wpisie nie trafiają do subskrybentów).
 */
export const NewsletterSaveToolbar = ({ deletable = false }: { deletable?: boolean }) => {
  const record = useRecordContext<{ newsletterSentAt?: string | null }>();
  const send = useWatch({ name: 'sendAsNewsletter' }) as boolean | undefined;
  const published = useWatch({ name: 'isPublished' }) as boolean | undefined;
  const publishAt = useWatch({ name: 'publishAt' }) as string | null | undefined;
  // zaplanowany na później – newsletter wyśle się sam o tej porze
  const [now] = useState(() => Date.now());
  const scheduled = !!publishAt && new Date(publishAt).getTime() > now;
  const when = scheduled
    ? new Date(publishAt!).toLocaleString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
    : '';
  const willSend = send !== false && !record?.newsletterSentAt;
  const [confirming, setConfirming] = useState(false);
  const confirmed = useSubscriberCount() ?? '…';
  const { save } = useSaveContext();
  const { handleSubmit, setValue } = useFormContext();

  // wyłącza wysyłkę i zapisuje (z walidacją formularza)
  const saveWithoutSending = () => {
    setValue('sendAsNewsletter', false, { shouldDirty: true });
    handleSubmit((values) => save?.({ ...values, sendAsNewsletter: false }))();
  };

  return (
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      {willSend ? (
        <Button variant="contained" startIcon={<SendIcon />} onClick={() => setConfirming(true)}>
          Zapisz
        </Button>
      ) : (
        <SaveButton />
      )}
      {deletable && <DeleteButton />}

      {willSend && confirming && (
        <Paper
          elevation={12}
          role="alertdialog"
          aria-labelledby="newsletter-confirm-title"
          // w rogu ekranu, bez tła – formularz pozostaje widoczny i przewijalny
          sx={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            zIndex: 1300,
            width: 'min(420px, calc(100vw - 48px))',
            p: 3,
            borderTop: '3px solid #c9a36a',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <WarningAmberIcon sx={{ color: '#c9a36a' }} />
            <Typography id="newsletter-confirm-title" variant="h6">
              {scheduled ? 'Zaplanować wysyłkę newslettera?' : 'Wysłać wpis jako newsletter?'}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mt: 1.5 }}>
            {scheduled ? (
              <>
                Wpis trafi e-mailem do potwierdzonych subskrybentów (obecnie <strong>{confirmed}</strong>){' '}
                <strong>{when}</strong>. Do tego czasu możesz go poprawiać – wyślemy najnowszą wersję.
              </>
            ) : (
              <>
                Po kliknięciu „Wyślij i zapisz” wpis trafi e-mailem do <strong>{confirmed}</strong> potwierdzonych
                subskrybentów. <strong>Wysłanej wiadomości nie będzie można już edytować</strong> – późniejsze poprawki
                zmienią tylko wpis na stronie.
              </>
            )}
          </Typography>
          {published === false && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Wpis <strong>nie pojawi się na stronie</strong> – subskrybenci dostaną całą treść w e-mailu.
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Przejrzyj jeszcze treść formularza – to okienko go nie zasłania.
          </Typography>
          <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <SaveButton label={scheduled ? 'Zaplanuj i zapisz' : 'Wyślij i zapisz'} icon={<SendIcon />} alwaysEnable />
            <Button variant="outlined" onClick={saveWithoutSending}>
              Zapisz bez wysyłki
            </Button>
            <Button onClick={() => setConfirming(false)}>Wróć do edycji</Button>
          </Box>
        </Paper>
      )}
    </Toolbar>
  );
};
