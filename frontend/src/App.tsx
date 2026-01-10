import { Admin, Resource, Menu, Layout, type LayoutProps, useSidebarState, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { Box, Typography, Divider } from '@mui/material';

import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';

import { ProductList, ProductCreate, ProductEdit } from './admin/components/products';
import { CategoryList, CategoryCreate, CategoryEdit } from './admin/components/categories';
import { ContactInfoList, ContactInfoEdit, ContactInfoCreate } from './admin/components/contact';
import { LocationList, LocationCreate, LocationEdit } from './admin/components/locations';
import { MediaList, MediaCreate, MediaEdit } from './admin/components/socialmedia';
import { BreadVanDescriptionShow } from './admin/components/breadVan';

import HomePage from './admin/pages/HomePage';
import HelpPage from './admin/pages/HelpPage';

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

const MyMenu = () => {
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
        to="/bread-van/description/b0fdfb94-7f07-47cd-8771-3fe21b17137a/show"
        primaryText="Description"
        leftIcon={<DirectionsBusFilledIcon />}
      />

      <Menu.Item
        to="/bread-van/schedule"
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

const MyLayout = (props: LayoutProps) => <Layout {...props} menu={MyMenu} />;

function App() {
  return (
    <Admin dashboard={HomePage} dataProvider={dataProvider} authProvider={authProvider} layout={MyLayout}>
      <CustomRoutes>
        <Route path="/help" element={<HelpPage />} />
      </CustomRoutes>
      <Resource
        name="products"
        list={ProductList}
        create={ProductCreate}
        edit={ProductEdit}
      />
      <Resource
        name="products/categories"
        options={{ label: 'Categories' }}
        list={CategoryList}
        create={CategoryCreate}
        edit={CategoryEdit}
      />
      <Resource
        name="contact/info"
        options={{ label: 'Contact info' }}
        list={ContactInfoList}
        create={ContactInfoCreate}
        edit={ContactInfoEdit}
      />
      <Resource
        name="contact/locations"
        options={{ label: 'Locations' }}
        list={LocationList}
        create={LocationCreate}
        edit={LocationEdit}
      />
      <Resource
        name="contact/media"
        options={{ label: 'Social media' }}
        list={MediaList}
        create={MediaCreate}
        edit={MediaEdit}
      />
      <Resource
        name="bread-van/locations"
        options={{ label: 'Bread-van schedule' }}
        //list={BreadVanScheduleList}
        // create, edit kiedy dopiszesz
      />
      <Resource
        name="bread-van/description"
        options={{ label: 'Bread-van description' }}
        show={BreadVanDescriptionShow}
      />
    </Admin>
  );
}

export default App;