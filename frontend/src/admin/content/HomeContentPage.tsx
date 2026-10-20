import { ContentEditor } from './ContentEditor';

/** Strona → Strona główna: teksty, zdjęcia i widoczność sekcji (karuzela – osobny ekran „Karuzela”) */
const HomeContentPage = () => (
  <ContentEditor
    page="home"
    title="Strona główna"
    path="/"
    intro="Sekcje w kolejności jak na stronie. Każdą zapisujesz osobno; zmiana pojawia się na stronie po kilku sekundach. Karuzelę na górze edytujesz w „Strona → Karuzela”, a produkty, piekarnie i wpisy – w ich zakładkach."
  />
);

export default HomeContentPage;
