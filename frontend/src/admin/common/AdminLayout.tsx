import { forwardRef } from 'react';
import { AppBar, Layout, LoadingIndicator, Logout, TitlePortal, UserMenu, useUserMenu, type LayoutProps } from 'react-admin';
import { Link } from 'react-router-dom';
import { Box, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { CustomMenu } from './CustomMenu';
import { ParentLink, ThemeToggle } from './AppBarControls';
import { useTrackQuickActions } from './quick-actions';
import { COLORS } from '../../theme';

/** „Moje konto” w menu konta (prawy górny róg) – dla każdego zalogowanego */
const AccountMenuItem = forwardRef<HTMLAnchorElement>((props, ref) => {
  const userMenu = useUserMenu();
  return (
    <MenuItem ref={ref} component={Link} to="/konto" onClick={() => userMenu?.onClose()} {...props}>
      <ListItemIcon>
        <ManageAccountsIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Moje konto</ListItemText>
    </MenuItem>
  );
});

/**
 * Górny pasek (zawsze widoczny, nie chowa się przy przewijaniu): logo piekarni (w obu trybach pasek jest ciemny),
 * strzałka do ekranu nadrzędnego (np. z edycji produktu do listy), tytuł bieżącej strony, przełącznik trybu, menu konta
 */
const AdminAppBar = () => (
  <AppBar
    alwaysOn
    color="inherit"
    toolbar={
      <>
        <ThemeToggle />
        <LoadingIndicator />
      </>
    }
    userMenu={
      <UserMenu>
        <AccountMenuItem />
        <Logout />
      </UserMenu>
    }
  >
    <Box
      component="img"
      src="/logo-poziome-biale.png"
      alt="Chleba Smak"
      sx={{ height: 22, mr: 2.5, display: { xs: 'none', sm: 'block' } }}
    />
    <Box sx={{ width: '1px', height: 22, bgcolor: COLORS.line, mr: 2.5, display: { xs: 'none', sm: 'block' } }} />
    <ParentLink />
    <TitlePortal
      sx={{
        fontFamily: '"Oswald", sans-serif',
        textTransform: 'uppercase',
        letterSpacing: { xs: '0.06em', sm: '0.12em' },
        fontSize: { xs: '0.8rem', sm: '0.95rem' },
        fontWeight: 400,
        // telefon: długi tytuł (np. nazwa produktu) kończy się wielokropkiem zamiast wchodzić pod przyciski
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    />
  </AppBar>
);

export const AdminLayout = (props: LayoutProps) => {
  // szybkie akcje na pulpicie uczą się z tego, które ekrany otwierasz najczęściej
  useTrackQuickActions();
  return <Layout {...props} appBar={AdminAppBar} menu={CustomMenu} />;
};
