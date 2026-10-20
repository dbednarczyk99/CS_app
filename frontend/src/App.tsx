import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';

import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import { i18nProvider } from './i18n';
import { darkTheme, lightTheme } from './theme';

import { ProductList, ProductCreate, ProductEdit } from './admin/components/products';
import { CategoryList, CategoryCreate, CategoryEdit } from './admin/components/categories';
import { LabelList, LabelCreate, LabelEdit } from './admin/components/labels';
import { ContactInfoList, ContactInfoEdit, ContactInfoCreate } from './admin/components/contact';
import { LocationList, LocationCreate, LocationEdit } from './admin/components/locations';
import { MediaList, MediaCreate, MediaEdit } from './admin/components/socialmedia';
import {
  BreadVanDescriptionShow,
  BreadVanDescriptionEdit,
  BreadVanScheduleCreate,
  BreadVanScheduleEdit,
  BreadVanScheduleList,
} from './admin/components/breadVan';
import { weekdayName } from './admin/common/weekdays';

import HomePage from './admin/pages/HomePage';
import HelpPage from './admin/pages/HelpPage';
import PreparationPage from './admin/pages/PreparationPage';
import AccountPage from './admin/pages/AccountPage';
import StatsPage from './admin/pages/StatsPage';
import HomeContentPage from './admin/content/HomeContentPage';
import PagesContentPage from './admin/content/PagesContentPage';
import CommonContentPage from './admin/content/CommonContentPage';
import ReservationRulesPage from './admin/pages/ReservationRulesPage';
import LegalDocumentsPage from './admin/pages/LegalDocumentsPage';
import { HeroSlideCreate, HeroSlideEdit, HeroSlideList } from './admin/content/heroSlides';
import { UserCreate, UserEdit, UserList } from './admin/components/users';
import { ReservationList, ReservationShow } from './admin/components/reservations';
import { AdminLayout } from './admin/common/AdminLayout';
import { LoginPage } from './admin/common/LoginPage';
import { BlogCreate, BlogEdit, BlogList } from './admin/components/blog';
import { AnnouncementCreate, AnnouncementEdit, AnnouncementList } from './admin/components/announcements';
import { NewsletterList } from './admin/components/newsletter';

// nazwy sekcji i pól są w i18n.ts; recordRepresentation = jak rekord nazywa się w tytułach („Produkt: Jagodzianka”).
// Rezerwacje, lista subskrybentów i konta tylko dla właściciela (ADMIN) – serwer pilnuje tego niezależnie.
function App() {
  return (
    <Admin
      title="Chleba Smak"
      dashboard={HomePage}
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      theme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="dark"
      layout={AdminLayout}
      loginPage={LoginPage}
    >
      {(permissions) => {
        const isOwner = permissions === 'ADMIN';
        return (
          <>
            <CustomRoutes>
              <Route path="/help" element={<HelpPage />} />
              <Route path="/konto" element={<AccountPage />} />
              {isOwner && <Route path="/przygotowanie" element={<PreparationPage />} />}
              {isOwner && <Route path="/ustawienia/rezerwacje" element={<ReservationRulesPage />} />}
              {isOwner && <Route path="/ustawienia/dokumenty/:doc?" element={<LegalDocumentsPage />} />}
              <Route path="/statystyki" element={<StatsPage />} />
              <Route path="/strona/glowna" element={<HomeContentPage />} />
              <Route path="/strona/podstrony/:tab?" element={<PagesContentPage />} />
              <Route path="/strona/wspolne" element={<CommonContentPage />} />
            </CustomRoutes>
            {isOwner && (
              <Resource
                name="reservations"
                list={ReservationList}
                show={ReservationShow}
                recordRepresentation="number"
              />
            )}
            <Resource
              name="products"
              list={ProductList}
              create={ProductCreate}
              edit={ProductEdit}
              recordRepresentation="name"
            />
            <Resource
              name="products/categories"
              list={CategoryList}
              create={CategoryCreate}
              edit={CategoryEdit}
              recordRepresentation="name"
            />
            <Resource
              name="products/labels"
              list={LabelList}
              create={LabelCreate}
              edit={LabelEdit}
              recordRepresentation="name"
            />
            <Resource
              name="content/hero-slides"
              list={HeroSlideList}
              create={HeroSlideCreate}
              edit={HeroSlideEdit}
              recordRepresentation="name"
            />
            <Resource
              name="contact/info"
              list={ContactInfoList}
              create={ContactInfoCreate}
              edit={ContactInfoEdit}
              recordRepresentation="value"
            />
            <Resource
              name="contact/locations"
              list={LocationList}
              create={LocationCreate}
              edit={LocationEdit}
              recordRepresentation="address"
            />
            <Resource
              name="contact/media"
              list={MediaList}
              create={MediaCreate}
              edit={MediaEdit}
              recordRepresentation="name"
            />
            <Resource name="bread-van/description" show={BreadVanDescriptionShow} edit={BreadVanDescriptionEdit} />
            <Resource
              name="bread-van/locations"
              list={BreadVanScheduleList}
              create={BreadVanScheduleCreate}
              edit={BreadVanScheduleEdit}
              recordRepresentation={(r) => `${weekdayName(r.dayOfTheWeek)} – ${r.address}`}
            />
            <Resource name="blog" list={BlogList} create={BlogCreate} edit={BlogEdit} recordRepresentation="title" />
            <Resource
              name="announcements"
              list={AnnouncementList}
              create={AnnouncementCreate}
              edit={AnnouncementEdit}
              recordRepresentation="message"
            />
            {isOwner && <Resource name="newsletter" list={NewsletterList} recordRepresentation="email" />}
            {isOwner && (
              <Resource
                name="users"
                list={UserList}
                create={UserCreate}
                edit={UserEdit}
                recordRepresentation={(r) => r.name || r.login}
              />
            )}
          </>
        );
      }}
    </Admin>
  );
}

export default App;
