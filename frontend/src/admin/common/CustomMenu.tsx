import { Menu, useSidebarState } from 'react-admin';
import { Box, Typography, Divider } from '@mui/material';

import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import ArticleIcon from '@mui/icons-material/Article';
import ShareIcon from '@mui/icons-material/Share';
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';
import ImageIcon from '@mui/icons-material/Image';
import UsersIcon from '@mui/icons-material/Group';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

export const CustomMenu = () => {
  const [open] = useSidebarState();

  return (
    <Menu>
      <Menu.Item
        to="/"
        primaryText="Home Page"
        leftIcon={<HomeIcon />}
      />
      <Menu.Item
        to="/help"
        primaryText="Help"
        leftIcon={<HelpIcon />}
      />

      {open && <Divider sx={{ my: 1 }} />}
      {open && (
        <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Bakery catalog
          </Typography>
        </Box>
      )}
      <Menu.Item
        to="/products"
        primaryText="Products"
        leftIcon={<BakeryDiningIcon />}
      />
      <Menu.Item
        to="/products/categories"
        primaryText="Categories"
        leftIcon={<CategoryIcon />}
      />

      {open && <Divider sx={{ my: 1 }} />}

      {open && (
        <Box sx={{ px: 2, pt: 0.5, pb: 0.5 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Locations & contact
          </Typography>
        </Box>
      )}
      <Menu.Item
        to="/contact/info"
        primaryText="Contact info"
        leftIcon={<PhoneIcon />}
      />
      <Menu.Item
        to="/contact/locations"
        primaryText="Locations"
        leftIcon={<LocationOnIcon />}
      />

      {open && <Divider sx={{ my: 1 }} />}

      {open && (
        <Box sx={{ px: 2, pt: 0.5, pb: 0.5 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Bread-van
          </Typography>
        </Box>
      )}

      <Menu.Item
        to="/bread-van/description/view/show"
        primaryText="Description"
        leftIcon={<DirectionsBusFilledIcon />}
      />

      <Menu.Item
        to="/bread-van/locations"
        primaryText="Schedule"
        leftIcon={<EditCalendarIcon />}
      />

      {open && <Divider sx={{ my: 1 }} />}

      {open && (
        <Box sx={{ px: 2, pt: 0.5, pb: 0.5 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Marketing & blog
          </Typography>
        </Box>
      )}
      <Menu.Item
        to="/blog"
        primaryText="Blog posts"
        leftIcon={<ArticleIcon />}
      />
      <Menu.Item
        to="/contact/media"
        primaryText="Social links"
        leftIcon={<ShareIcon />}
      />

      {open && <Divider sx={{ my: 1 }} />}

      {open && (
        <Box sx={{ px: 2, pt: 0.5, pb: 0.5 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Site settings
          </Typography>
        </Box>
      )}

      <Menu.Item
        to="/graphics"
        primaryText="Graphics"
        leftIcon={<ImageIcon />}
      />

      <Menu.Item
        to="/users"
        primaryText="Users"
        leftIcon={<UsersIcon />}
      />

    </Menu>
  );
};