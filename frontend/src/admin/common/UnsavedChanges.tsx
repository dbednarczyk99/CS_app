import { useEffect, useState } from 'react';
import { useFormState } from 'react-hook-form';
import { useBlocker } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * Ostrzeżenie przed opuszczeniem ekranu z niezapisanymi zmianami: okienko „Zostań / Wyjdź bez zapisywania”
 * przy przejściu w panelu (menu, strzałka, zakładka) i okno przeglądarki przy zamknięciu karty lub odświeżeniu.
 * Na jednym ekranie może być tylko jedno (router obsługuje jedną blokadę naraz).
 */
export function UnsavedChangesDialog({
  when,
  formPath,
}: {
  /** są niezapisane zmiany */
  when: boolean;
  /** przejścia w obrębie tego adresu nie blokują (np. zakładki formularza) */
  formPath?: string;
}) {
  const [open, setOpen] = useState(false);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (!when || nextLocation.pathname === currentLocation.pathname) return false;
    return !(formPath && nextLocation.pathname.startsWith(formPath));
  });

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    // przekierowanie tuż po zapisie (formularz już „czysty”) – bez pytania
    if (!when) blocker.proceed();
    else setOpen(true);
    // tylko przy zmianie stanu blokady
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker.state]);

  // zamknięcie karty / odświeżenie – okno przeglądarki
  useEffect(() => {
    if (!when) return;
    const beforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = true;
    };
    window.addEventListener('beforeunload', beforeunload);
    return () => window.removeEventListener('beforeunload', beforeunload);
  }, [when]);

  const stay = () => {
    setOpen(false);
    if (blocker.state === 'blocked') blocker.reset();
  };
  const leave = () => {
    setOpen(false);
    if (blocker.state === 'blocked') blocker.proceed();
  };

  return (
    <Dialog open={open} onClose={stay} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon color="warning" /> Niezapisane zmiany
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Na tym ekranie są zmiany, których nie zapisano. Jeśli wyjdziesz teraz, zostaną utracone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={leave}>
          Wyjdź bez zapisywania
        </Button>
        <Button variant="contained" onClick={stay} autoFocus>
          Zostań i zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * To samo dla formularzy react-admin (produkt, wpis, slajd…): wstawiane jako dziecko formularza; zapisany
 * formularz (przekierowanie po „Zapisz”) nie blokuje.
 */
export function FormUnsavedChanges() {
  const { dirtyFields, isSubmitSuccessful, isSubmitting } = useFormState();
  const dirty = Object.keys(dirtyFields).length > 0 && !isSubmitSuccessful && !isSubmitting;
  return <UnsavedChangesDialog when={dirty} />;
}
