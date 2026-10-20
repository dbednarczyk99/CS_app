import type { ReactElement } from 'react';
import { SimpleList, type SimpleListProps } from 'react-admin';
import { useMediaQuery, type Theme } from '@mui/material';

/**
 * Lista na telefonie: zamiast tabeli (która się nie mieści) – karty z najważniejszymi informacjami
 * (SimpleList: tytuł, opis, wartość po prawej, miniatura). Na tablecie i komputerze – zwykła tabela (children).
 */
export function MobileList({ children, ...props }: SimpleListProps & { children: ReactElement }) {
  const small = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  return small ? <SimpleList {...props} /> : children;
}
