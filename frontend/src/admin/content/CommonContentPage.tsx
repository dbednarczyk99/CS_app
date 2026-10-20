import { ContentEditor } from './ContentEditor';

/** Strona → Elementy wspólne: stopka, okienko newslettera, strona 404 i domyślne zdjęcie do udostępniania */
const CommonContentPage = () => (
  <ContentEditor
    page="common"
    title="Elementy wspólne"
    path="/"
    intro="Elementy widoczne na wszystkich stronach. Każdą sekcję zapisujesz osobno; zmiana pojawia się na stronie po kilku sekundach."
  />
);

export default CommonContentPage;
