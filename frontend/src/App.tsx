import {
  Admin,
  Resource,
  Layout,
  CustomRoutes,
  type LayoutProps,
} from 'react-admin';
import { Route } from 'react-router-dom';

import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';

import { ProductList, ProductCreate, ProductEdit } from './admin/components/products';
import { CategoryList, CategoryCreate, CategoryEdit } from './admin/components/categories';
import { ContactInfoList, ContactInfoEdit, ContactInfoCreate } from './admin/components/contact';
import { LocationList, LocationCreate, LocationEdit } from './admin/components/locations';
import { MediaList, MediaCreate, MediaEdit } from './admin/components/socialmedia';
import {
  BreadVanDescriptionShow,
  BreadVanDescriptionEdit,
  BreadVanScheduleCreate,
  BreadVanScheduleEdit,
  BreadVanScheduleList
} from './admin/components/breadVan';

import HomePage from './admin/pages/HomePage';
import HelpPage from './admin/pages/HelpPage';
import { CustomMenu } from './admin/common/CustomMenu';

const MyLayout = (props: LayoutProps) => <Layout {...props} menu={CustomMenu} />;

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
        name="bread-van/description"
        options={{ label: 'Bread-van description' }}
        show={BreadVanDescriptionShow}
        edit={BreadVanDescriptionEdit}
      />

      <Resource
        name="bread-van/locations"
        options={{ label: 'Bread-van schedule' }}
        list={BreadVanScheduleList}
        create={BreadVanScheduleCreate}
        edit={BreadVanScheduleEdit}
      />
    </Admin>
  );
}

export default App;