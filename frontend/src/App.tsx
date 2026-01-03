import { Admin, Resource, Menu, Layout, type LayoutProps, useSidebarState } from 'react-admin';
import { Box, Typography, Divider } from '@mui/material';

import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';

import { ProductList, ProductCreate, ProductEdit } from './admin/products';
import { CategoryList, CategoryCreate, CategoryEdit } from './admin/categories';
import { ContactInfoList, ContactInfoEdit, ContactInfoCreate } from './admin/contact';
import { LocationList, LocationCreate, LocationEdit } from './admin/locations';

import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import ArticleIcon from '@mui/icons-material/Article';
import ShareIcon from '@mui/icons-material/Share';

const MyMenu = () => {
  const [open] = useSidebarState();

  return (
    <Menu>
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
      <Menu.Item
        to="/bread-van"
        primaryText="Bread van schedule"
        leftIcon={<DirectionsBusFilledIcon />}
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
        to="/media"
        primaryText="Social links"
        leftIcon={<ShareIcon />}
      />
    </Menu>
  );
};

const MyLayout = (props: LayoutProps) => <Layout {...props} menu={MyMenu} />;

function App() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider} layout={MyLayout}>
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
    </Admin>
  );
}

export default App;