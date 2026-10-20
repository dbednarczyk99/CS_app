import { Menu, usePermissions, useSidebarState } from 'react-admin';
import { Box, Typography, Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { CONTACT_TABS, HOME_TABS, OFFER_TABS, isTabActive } from './screen-tabs';

import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import CategoryIcon from '@mui/icons-material/Category';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import ArticleIcon from '@mui/icons-material/Article';
import EventIcon from '@mui/icons-material/Event';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HelpIcon from '@mui/icons-material/Help';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CampaignIcon from '@mui/icons-material/Campaign';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import GroupIcon from '@mui/icons-material/Group';
import InsightsIcon from '@mui/icons-material/Insights';
import HomeIcon from '@mui/icons-material/Home';
import WebIcon from '@mui/icons-material/Web';
import EventNoteIcon from '@mui/icons-material/EventNote';
import GavelIcon from '@mui/icons-material/Gavel';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

/** Nagłówek grupy w menu (widoczny przy rozwiniętym menu) */
const Section = ({ title }: { title: string }) => {
  const [open] = useSidebarState();
  if (!open) return <Divider sx={{ my: 1 }} />;
  return (
    <>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
        <Typography variant="overline" color="primary" sx={{ lineHeight: 1.4, display: 'block' }}>
          {title}
        </Typography>
      </Box>
    </>
  );
};

// „Produkty” (/products) nie podświetla się na stronach kategorii i etykiet (/products/categories, /products/labels)
const notActive = {
  '&.RaMenuItemLink-active': {
    borderLeftColor: 'transparent',
    color: 'text.secondary',
    '& .RaMenuItemLink-icon': { color: 'action.active' },
  },
};

export const CustomMenu = () => {
  const { pathname } = useLocation();
  // rezerwacje, zasady rezerwacji, dokumenty prawne i konta – tylko administrator
  const { permissions } = usePermissions();
  const isOwner = permissions === 'ADMIN';
  return (
    <Menu>
      <Menu.Item to="/" primaryText="Pulpit" leftIcon={<DashboardIcon />} />
      <Menu.Item to="/statystyki" primaryText="Statystyki" leftIcon={<InsightsIcon />} />

      {isOwner && (
        <>
          <Section title="Rezerwacje" />
          <Menu.Item to="/reservations" primaryText="Rezerwacje" leftIcon={<ReceiptLongIcon />} />
          <Menu.Item to="/przygotowanie" primaryText="Do przygotowania" leftIcon={<ChecklistIcon />} />
          <Menu.Item to="/ustawienia/rezerwacje" primaryText="Zasady rezerwacji" leftIcon={<EventNoteIcon />} />
        </>
      )}

      <Section title="Oferta" />
      <Menu.Item
        to="/products"
        primaryText="Produkty"
        leftIcon={<BakeryDiningIcon />}
        sx={/^\/products\/(categories|labels)/.test(pathname) ? notActive : undefined}
      />
      {/* kategorie i etykiety – jeden ekran z zakładkami; pozycja podświetlona na obu */}
      <Menu.Item
        to="/products/categories"
        primaryText="Kategorie i etykiety"
        leftIcon={<CategoryIcon />}
        className={isTabActive(OFFER_TABS, pathname) ? 'RaMenuItemLink-active' : undefined}
      />

      <Section title="Marketing" />
      <Menu.Item to="/blog" primaryText="Aktualności i newsletter" leftIcon={<ArticleIcon />} />
      <Menu.Item to="/marketing/zaplanowane" primaryText="Zaplanowane" leftIcon={<EventIcon />} />
      <Menu.Item to="/announcements" primaryText="Baner informacyjny" leftIcon={<CampaignIcon />} />
      <Menu.Item to="/newsletter" primaryText="Subskrybenci" leftIcon={<MarkEmailReadIcon />} />

      {/* treści strony („domowy WordPress”) */}
      <Section title="Strona" />
      <Menu.Item
        to="/strona/glowna"
        primaryText="Strona główna"
        leftIcon={<HomeIcon />}
        className={isTabActive(HOME_TABS, pathname) ? 'RaMenuItemLink-active' : undefined}
      />
      <Menu.Item to="/strona/podstrony" primaryText="Podstrony" leftIcon={<WebIcon />} />
      {isOwner && <Menu.Item to="/ustawienia/dokumenty" primaryText="Dokumenty prawne" leftIcon={<GavelIcon />} />}

      <Section title="Piekarnie i kontakt" />
      <Menu.Item to="/contact/locations" primaryText="Piekarnie" leftIcon={<StorefrontIcon />} />
      {/* trasa i opis – jeden ekran z zakładkami; pozycja podświetlona na obu */}
      <Menu.Item
        to="/bread-van/locations"
        primaryText="Chlebowóz"
        leftIcon={<DirectionsBusFilledIcon />}
        className={pathname.startsWith('/bread-van') ? 'RaMenuItemLink-active' : undefined}
      />
      <Menu.Item
        to="/contact/info"
        primaryText="Kontakt"
        leftIcon={<PhoneIcon />}
        className={isTabActive(CONTACT_TABS, pathname) ? 'RaMenuItemLink-active' : undefined}
      />

      <Divider sx={{ my: 1 }} />
      {isOwner && <Menu.Item to="/ustawienia/uslugi" primaryText="Usługi i koszty" leftIcon={<PowerSettingsNewIcon />} />}
      {isOwner && <Menu.Item to="/users" primaryText="Konta" leftIcon={<GroupIcon />} />}
      <Menu.Item to="/help" primaryText="Pomoc" leftIcon={<HelpIcon />} />
    </Menu>
  );
};
