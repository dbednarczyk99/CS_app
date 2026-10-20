import { ScreenTabs } from '../common/ScreenTabs';
import { HOME_TABS } from '../common/screen-tabs';
import { ContentEditor } from './ContentEditor';

/** Strona → Strona główna: teksty, zdjęcia i widoczność sekcji (karuzela – osobny ekran „Karuzela”) */
const HomeContentPage = () => (
  <>
  <ScreenTabs tabs={HOME_TABS} />
  <ContentEditor
    page="home"
    title="Strona główna"
    path="/"
    intro="Sekcje w kolejności jak na stronie. Każdą zapisujesz osobno; zmiana pojawia się na stronie po kilku sekundach. Karuzelę na górze edytujesz w zakładce „Karuzela”, a produkty, piekarnie i wpisy – w ich zakładkach."
  />
  </>
);

export default HomeContentPage;
