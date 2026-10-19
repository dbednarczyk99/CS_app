import { Menu, usePermissions, useSidebarState } from 'react-admin';
import { Box, Typography, Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';

import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import CategoryIcon from '@mui/icons-material/Category';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import ArticleIcon from '@mui/icons-material/Article';
import ShareIcon from '@mui/icons-material/Share';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HelpIcon from '@mui/icons-material/Help';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CampaignIcon from '@mui/icons-material/Campaign';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import GroupIcon from '@mui/icons-material/Group';
import InsightsIcon from '@mui/icons-material/Insights';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

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
  // rezerwacje, lista subskrybentów i konta – tylko właściciel
  const { permissions } = usePermissions();
  const isOwner = permissions === 'ADMIN';
  return (
    <Menu>
      <Menu.Item to="/" primaryText="Pulpit" leftIcon={<DashboardIcon />} />
      <Menu.Item to="/statystyki" primaryText="Statystyki" leftIcon={<InsightsIcon />} />
      <Menu.Item to="/help" primaryText="Pomoc" leftIcon={<HelpIcon />} />

      {isOwner && (
        <>
          <Section title="Rezerwacje" />
          <Menu.Item to="/reservations" primaryText="Rezerwacje" leftIcon={<ReceiptLongIcon />} />
          <Menu.Item to="/przygotowanie" primaryText="Do przygotowania" leftIcon={<ChecklistIcon />} />
        </>
      )}

      <Section title="Oferta" />
      <Menu.Item
        to="/products"
        primaryText="Produkty"
        leftIcon={<BakeryDiningIcon />}
        sx={/^\/products\/(categories|labels)/.test(pathname) ? notActive : undefined}
      />
      <Menu.Item to="/products/categories" primaryText="Kategorie" leftIcon={<CategoryIcon />} />
      <Menu.Item to="/products/labels" primaryText="Etykiety" leftIcon={<LocalOfferIcon />} />

      <Section title="Piekarnie i kontakt" />
      <Menu.Item to="/contact/locations" primaryText="Piekarnie" leftIcon={<StorefrontIcon />} />
      <Menu.Item to="/contact/info" primaryText="Dane kontaktowe" leftIcon={<PhoneIcon />} />
      <Menu.Item to="/contact/media" primaryText="Media społecznościowe" leftIcon={<ShareIcon />} />

      <Section title="Chlebowóz" />
      <Menu.Item to="/bread-van/locations" primaryText="Trasa" leftIcon={<EditCalendarIcon />} />
      <Menu.Item
        to="/bread-van/description/view/show"
        primaryText="Opis i zdjęcia"
        leftIcon={<DirectionsBusFilledIcon />}
      />

      <Section title="Komunikacja" />
      <Menu.Item to="/blog" primaryText="Aktualności (blog)" leftIcon={<ArticleIcon />} />
      <Menu.Item to="/announcements" primaryText="Baner informacyjny" leftIcon={<CampaignIcon />} />
      {isOwner && <Menu.Item to="/newsletter" primaryText="Newsletter" leftIcon={<MarkEmailReadIcon />} />}

      {isOwner && (
        <>
          <Section title="Ustawienia" />
          <Menu.Item to="/users" primaryText="Konta" leftIcon={<GroupIcon />} />
        </>
      )}
    </Menu>
  );
};
