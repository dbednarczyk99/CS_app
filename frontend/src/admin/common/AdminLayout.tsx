import { forwardRef } from 'react';
import { AppBar, Layout, Logout, TitlePortal, UserMenu, useUserMenu, type LayoutProps } from 'react-admin';
import { Link } from 'react-router-dom';
import { Box, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { CustomMenu } from './CustomMenu';
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

/** Górny pasek: logo piekarni (w obu trybach pasek jest ciemny), tytuł bieżącej strony, menu konta */
const AdminAppBar = () => (
  <AppBar
    color="inherit"
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
    <TitlePortal
      sx={{
        fontFamily: '"Oswald", sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        fontSize: '0.95rem',
        fontWeight: 400,
      }}
    />
  </AppBar>
);

export const AdminLayout = (props: LayoutProps) => <Layout {...props} appBar={AdminAppBar} menu={CustomMenu} />;
