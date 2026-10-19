import { Title } from 'react-admin';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/** Pomoc: krótkie instrukcje do najczęstszych czynności w panelu */
const TOPICS: { section: string; items: { q: string; a: string }[] }[] = [
  {
    section: 'Rezerwacje',
    items: [
      {
        q: 'Gdzie zobaczę, co przygotować na jutro?',
        a: '„Do przygotowania” pokazuje zestawienie na wybrany dzień (domyślnie jutro): ile czego przygotować w sumie i w każdym punkcie oraz listę rezerwacji. Zestawienie można wydrukować albo wysłać e-mailem.',
      },
      {
        q: 'Czy mogę zmienić status rezerwacji?',
        a: 'Nie – rezerwacje są tylko do podglądu. Status zmienia wyłącznie klient (anulowanie linkiem z e-maila, do 18:00 dnia poprzedniego).',
      },
      {
        q: 'Klient prosi o usunięcie swoich danych',
        a: 'Otwórz rezerwację i kliknij „Usuń dane klienta”. Imię, telefon, e-mail i uwagi zostaną trwale usunięte; produkty i termin zostają w statystykach. Dane wszystkich klientów są też usuwane automatycznie po 6 miesiącach.',
      },
    ],
  },
  {
    section: 'Oferta',
    items: [
      {
        q: 'Jak dodać lub ukryć produkt?',
        a: '„Produkty” → „Dodaj”. Produkt bez zaznaczenia „Aktywny” nie pokazuje się na stronie. „Można rezerwować online” decyduje, czy klient może go zarezerwować (np. lody – tylko na miejscu).',
      },
      {
        q: 'Produkty sezonowe',
        a: 'Zaznacz „Produkt sezonowy”. Gdy sezon się kończy, wyłącz „W sezonie – teraz dostępny” – produkt przejdzie na stronie do sekcji „Wrócą w sezonie” (bez ceny i rezerwacji).',
      },
      {
        q: 'Etykiety (Nowość, Bestseller, własne)',
        a: 'Etykiety zaznaczasz w formularzu produktu. Własne etykiety (np. „Wegańskie”, „Na święta”) dodasz w „Etykiety” – z nazwą, kolorem i kolejnością. Etykieta z co najmniej jednym produktem pojawia się na zdjęciu produktu i jako filtr w ofercie, a produkty z etykietami są pokazywane w pierwszej kolejności na stronie głównej. Usunięcie etykiety zdejmuje ją z produktów – same produkty zostają. Etykietę „Promocja” strona nadaje sama w czasie promocji – możesz zmienić jej nazwę, kolor i kolejność, ale nie da się jej usunąć. Etykieta może mieć okres widoczności („Widoczna od / do”, np. „Na święta”) – poza nim znika ze strony sama, a przypisania zostają na następny rok.',
      },
      {
        q: 'Jak ustawić promocję?',
        a: 'W formularzu produktu włącz „Promocja”. Cena promocyjna jest opcjonalna – bez niej produkt dostaje tylko etykietę „Promocja”. Daty „Od” i „Do” są włącznie; promocja włącza się i wyłącza sama (puste pole = od razu / bez końca). W czasie promocji stara cena jest na stronie przekreślona. Rezerwacja liczy się po cenie promocyjnej, gdy dzień odbioru mieści się w okresie promocji – jeśli odbiór wypada już po jej końcu, klient płaci cenę regularną (formularz rezerwacji wyraźnie go o tym uprzedza). W ofercie pojawia się filtr „Promocje”, a na pasku pod menu – zbiorczy komunikat o promocjach (jego treść zmienisz w „Baner informacyjny”).',
      },
      {
        q: 'Czy promocja się opłaciła?',
        a: '„Statystyki” → „Skuteczność promocji”: dla każdej promocji porównanie zarezerwowanych sztuk i wyświetleń produktu w czasie promocji z tak samo długim okresem tuż przed nią. Sprzedaży w sklepie bez rezerwacji strona nie widzi.',
      },
      {
        q: 'Jak zaplanować pojawienie się produktu?',
        a: 'W formularzu produktu, w sekcji „Planowanie”, ustaw „Dostępny od” (data) – od tego dnia nowy produkt pojawi się w ofercie, a sezonowy wróci do sprzedaży (także gdy nikt nie będzie wtedy przy komputerze). „Niedostępny od” działa odwrotnie: sezonowy przejdzie do „Wrócą w sezonie”, zwykły zniknie z oferty. Po wykonaniu data się czyści; ręczna zmiana przełączników działa od razu. Wpis zapowiadający produkt możesz zaplanować na tę samą godzinę – formularz wpisu ostrzeże, jeśli produkt albo promocja nie zdążą.',
      },
      {
        q: 'Kolejność zdjęć',
        a: 'Zdjęcia przeciągnij myszką – pierwsze (oznaczone „Główne”) widać na karcie produktu na stronie.',
      },
    ],
  },
  {
    section: 'Piekarnie i chlebowóz',
    items: [
      {
        q: 'Jak zmienić godziny otwarcia?',
        a: '„Piekarnie” → wybierz lokal → „Godziny otwarcia”. Dzień, w którym lokal jest zamknięty, ustaw jako „Nieczynne”. Godziny otwarcia wyznaczają też godziny odbioru rezerwacji.',
      },
      {
        q: 'Jak ustawić trasę chlebowozu?',
        a: '„Chlebowóz” → „Trasa”: jeden przystanek na dzień tygodnia (dzień, godziny, adres). Dzień, w którym chlebowóz nie kursuje, usuń z listy – na stronie pojawi się „Chlebowóz odpoczywa”. Gdy ten sam przystanek jest w kilka dni, wpisz za każdym razem ten sam adres i położenie.',
      },
      {
        q: 'Ocena piekarni w Google',
        a: 'W formularzu piekarni wpisz „Identyfikator miejsca Google (Place ID)” – na stronie „Piekarnie” pojawi się ocena (gwiazdki i liczba opinii, odświeżane raz dziennie) i link „Oceń nas w Google”. Identyfikator znajdziesz w narzędziu Place ID Finder (link przy polu).',
      },
      {
        q: 'Punkt nie pojawia się na mapie',
        a: 'Brakuje położenia. W formularzu piekarni lub przystanku kliknij „Uzupełnij z adresu” (albo wpisz współrzędne ręcznie) i zapisz.',
      },
    ],
  },
  {
    section: 'Konta i hasła',
    items: [
      {
        q: 'Kto ma dostęp do czego?',
        a: 'Właściciel widzi wszystko, w tym rezerwacje z danymi klientów, listę subskrybentów newslettera i konta. Konto „Treści strony” (social media) edytuje produkty, piekarnie, chlebowóz, aktualności, baner i media społecznościowe oraz widzi statystyki odwiedzin (skąd przychodzi ruch, najczęściej odwiedzane strony) – bez dostępu do danych klientów i kosztów.',
      },
      {
        q: 'Jak zmienić swoje hasło?',
        a: 'Kliknij ikonę konta w prawym górnym rogu → „Moje konto”. Nowe hasło musi mieć co najmniej 10 znaków; po zmianie inne urządzenia zostaną wylogowane.',
      },
      {
        q: 'Ktoś zapomniał hasła',
        a: 'Właściciel ustawia nowe hasło w „Konta” → wybierz osobę → „Nowe hasło”. Gdy hasła zapomni właściciel, osoba administrująca serwerem może je zresetować poleceniem awaryjnym.',
      },
    ],
  },
  {
    section: 'Komunikacja z klientami',
    items: [
      {
        q: 'Jak wysłać newsletter?',
        a: 'Newsletterem są wpisy w „Aktualnościach”. Przy zapisie wpisu z włączoną opcją „Wyślij jako newsletter” panel poprosi o potwierdzenie i wyśle wpis do potwierdzonych subskrybentów – tylko raz. Wyłącz „Opublikuj na stronie”, aby wysłać wpis tylko e-mailem. „Podgląd e-maila” pod treścią pokazuje, jak wpis zobaczą subskrybenci – bez wysyłania.',
      },
      {
        q: 'Jak zaplanować wpis lub newsletter na później?',
        a: 'W formularzu wpisu ustaw „Zaplanuj publikację”. Wpis pojawi się na stronie i (jeśli zaznaczono) zostanie wysłany jako newsletter o wybranej godzinie – do tego czasu możesz go poprawiać, wyślemy najnowszą wersję. Na liście wpisów widać „zaplanowany: …”.',
      },
      {
        q: 'Jak wstawić produkt do wpisu?',
        a: 'Pod treścią wpisu wybierz produkt i kliknij „Wstaw kafelek” (w miejscu kursora) albo „Wstaw aktualne promocje”. W treści pojawi się akapit „[produkt: …]” – na stronie i w newsletterze zamienia się w kartę produktu ze zdjęciem, ceną i linkiem. Możesz go przesunąć albo usunąć jak zwykły tekst.',
      },
      {
        q: 'Ile osób weszło z newslettera?',
        a: '„Statystyki” → „Newslettery”: dla każdej wysyłki liczba odbiorców, wejść na stronę z linków w e-mailu i kliknięte produkty z kafelków. Bez pikseli śledzących – samo otwarcie e-maila nie jest liczone.',
      },
      {
        q: 'Jak dodać komunikat na pasku pod menu strony?',
        a: '„Baner informacyjny” → „Dodaj”: krótka treść, opcjonalnie przycisk z linkiem (np. do wpisu lub okienka zapisu do newslettera) i okres wyświetlania. Po dacie „Do” komunikat znika sam.',
      },
    ],
  },
];

const HelpPage = () => (
  <Box sx={{ maxWidth: 900, mx: 'auto', py: { xs: 2, md: 4 } }}>
    <Title title="Pomoc" />
    <Typography variant="overline" color="primary">
      Pomoc
    </Typography>
    <Typography variant="h4" sx={{ mt: 0.5, mb: 1 }}>
      Jak korzystać z panelu
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 4 }}>
      Zmiany zapisane w panelu pojawiają się na stronie po kilku sekundach. Po zapisaniu przez ok. 5 sekund możesz je cofnąć
      przyciskiem „Cofnij”.
    </Typography>

    {TOPICS.map(({ section, items }) => (
      <Box key={section} sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>
          {section}
        </Typography>
        {items.map(({ q, a }) => (
          <Accordion key={q} disableGutters variant="outlined">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={700}>{q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    ))}

    <Typography variant="body2" color="text.secondary">
      Brak odpowiedzi na Twoje pytanie? Skontaktuj się z osobą, która administruje stroną.
    </Typography>
  </Box>
);

export default HelpPage;
