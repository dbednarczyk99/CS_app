import { Title } from 'react-admin';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';
import { ContentEditor } from './ContentEditor';

/** Podstrony w kolejności menu strony: zakładka (adres w panelu) → strona w opisie sekcji i adres na stronie */
const PAGES = [
  {
    tab: 'o-nas',
    page: 'about',
    label: 'O nas',
    path: '/o-nas',
    intro: 'Historia piekarni, zasady i zdjęcia.',
  },
  {
    tab: 'oferta',
    page: 'offer',
    label: 'Oferta',
    path: '/oferta',
    intro: 'Nagłówek nad listą produktów. Same produkty, kategorie i etykiety zmieniasz w „Oferta”.',
  },
  {
    tab: 'piekarnie',
    page: 'locations',
    label: 'Piekarnie',
    path: '/piekarnie',
    intro: 'Teksty wokół listy piekarni. Adresy, godziny i zdjęcia piekarni zmieniasz w „Piekarnie → Piekarnie”.',
  },
  {
    tab: 'chlebowoz',
    page: 'van',
    label: 'Chlebowóz',
    path: '/chlebowoz',
    intro: 'Nagłówki i ramka na dole strony. Opis chlebowozu i trasę zmieniasz w „Piekarnie → Chlebowóz”.',
  },
  {
    tab: 'aktualnosci',
    page: 'news',
    label: 'Aktualności',
    path: '/aktualnosci',
    intro: 'Nagłówek listy wpisów. Same wpisy – w „Marketing → Aktualności i newsletter”.',
  },
  {
    tab: 'kontakt',
    page: 'contact',
    label: 'Kontakt',
    path: '/kontakt',
    intro: 'Teksty strony kontaktowej. Telefon, e-mail i media społecznościowe – w „Kontakt”.',
  },
  {
    tab: 'rezerwacja',
    page: 'reservation',
    label: 'Rezerwacja',
    path: '/rezerwacja',
    intro: 'Nagłówek i teksty formularza rezerwacji. Zasady (godzina, dni, limit) – w „Rezerwacje → Zasady rezerwacji”.',
  },
  {
    tab: 'wspolne',
    page: 'common',
    label: 'Elementy wspólne',
    path: '/',
    intro: 'Elementy widoczne na wszystkich stronach: stopka, okienko newslettera, strona 404 i domyślne zdjęcie do udostępniania.',
  },
];

/** Strona → Podstrony: zakładka na każdą podstronę (w każdej – SEO i sekcje treści) i na elementy wspólne */
const PagesContentPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const current = PAGES.find((p) => p.tab === tab) ?? PAGES[0];
  return (
    <Box>
      <Title title={`Podstrony – ${current.label}`} />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: 1000, mx: 'auto', mt: { xs: 1, md: 2 } }}>
        <Tabs
          value={current.tab}
          onChange={(_, value: string) => navigate(`/strona/podstrony/${value}`)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {PAGES.map((p) => (
            <Tab key={p.tab} value={p.tab} label={p.label} />
          ))}
        </Tabs>
      </Box>
      {/* key – nowa zakładka wczytuje swoje sekcje od nowa */}
      <ContentEditor
        key={current.page}
        page={current.page}
        title={current.label}
        path={current.path}
        intro={`${current.intro} Każdą sekcję zapisujesz osobno; zmiana pojawia się na stronie po kilku sekundach.`}
        embedded
      />
    </Box>
  );
};

export default PagesContentPage;
