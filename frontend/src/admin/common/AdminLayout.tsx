import { AppBar, Layout, TitlePortal, type LayoutProps } from 'react-admin';
import { Box } from '@mui/material';
import { CustomMenu } from './CustomMenu';
import { COLORS } from '../../theme';

/** Górny pasek: logo piekarni (w obu trybach pasek jest ciemny), tytuł bieżącej strony */
const AdminAppBar = () => (
  <AppBar color="inherit">
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
