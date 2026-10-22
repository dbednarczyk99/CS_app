import { useState } from 'react';
import { Title } from 'react-admin';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

/** Kontakt do pomocy technicznej (wykonawca strony) – ustawiany przy wdrożeniu w frontend/.env (VITE_SUPPORT_*) */
const SUPPORT = {
  name: import.meta.env.VITE_SUPPORT_NAME as string | undefined,
  phone: import.meta.env.VITE_SUPPORT_PHONE as string | undefined,
  email: import.meta.env.VITE_SUPPORT_EMAIL as string | undefined,
};

/** Pomoc: krótkie instrukcje do najczęstszych czynności w panelu */
const TOPICS: { section: string; items: { q: string; a: string }[] }[] = [
  {
    section: 'Gdy coś nie działa',
    items: [
      {
        q: 'Zmieniłem coś w panelu, a na stronie tego nie widać',
        a: 'Zmiany pojawiają się na stronie po kilku sekundach. Odśwież stronę w przeglądarce (F5, na telefonie – przeciągnij w dół). Jeśli nadal widać starą wersję: sprawdź, czy zmiana została zapisana (po zapisie pojawia się zielony komunikat), czy sekcja albo produkt są włączone („Pokazuj na stronie”, „Aktywny”) i czy nie ustawiono daty „Dostępny od” w przyszłości. Gdy to nie pomoże – skontaktuj się z pomocą techniczną (na górze tej strony).',
      },
      {
        q: 'Na pulpicie jest ostrzeżenie o usłudze – co to znaczy?',
        a: 'Któraś płatna usługa (e-maile, mapa Google, ocena Google) jest wyłączona albo przekroczyła limit dzienny. Strona działa dalej, tylko pokazuje zamiennik: zamiast mapy – listę adresów, bez e-maili – klient dostaje numer rezerwacji tylko na ekranie. Limit dzienny sam się odnawia o północy. Szczegóły i przełączniki: „Usługi i koszty” (administrator).',
      },
      {
        q: 'Klient nie dostał e-maila z potwierdzeniem rezerwacji',
        a: 'Poproś klienta o sprawdzenie folderu „Spam” / „Oferty”. W szczegółach rezerwacji sprawdź, czy adres e-mail jest wpisany poprawnie. Jeśli na pulpicie jest ostrzeżenie o e-mailach, wysyłka jest wstrzymana (wyłącznik albo limit dzienny – „Usługi i koszty”). Rezerwacja jest ważna także bez e-maila – liczy się numer, który klient zobaczył na ekranie i który widać w panelu.',
      },
      {
        q: 'Klient dzwoni, że chce anulować albo zmienić rezerwację',
        a: 'W panelu rezerwacji nie da się anulować ani zmieniać. Najprościej: klient anuluje ją sam linkiem z e-maila (do godziny zamykania rezerwacji dnia poprzedniego) i składa nową. Jeśli nie może – przyjmijcie informację telefonicznie i po prostu nie przygotowujcie tej rezerwacji; w panelu zostanie jako „przyjęta”.',
      },
      {
        q: 'Klient nie odebrał rezerwacji',
        a: 'Panel nie rejestruje odbiorów – nic nie trzeba w nim robić. Zasady postępowania z nieodebranymi rezerwacjami opisuje regulamin (np. do kiedy rezerwacja czeka na odbiór).',
      },
      {
        q: 'Piekarnia jest nieczynna w święto lub z powodu remontu',
        a: 'Godziny otwarcia ustawia się na każdy dzień tygodnia („Piekarnie” → wybierz lokal → przełącznik „Czynne / Nieczynne”). Na pojedyncze zamknięcie: na czas zamknięcia ustaw ten dzień tygodnia jako nieczynny (rezerwacje na ten dzień w tym lokalu nie będą możliwe), dodaj komunikat na „Banerze informacyjnym” i po zamknięciu przywróć godziny. Zamknięcie w konkretną datę bez zmiany godzin tygodniowych to możliwe rozszerzenie panelu.',
      },
      {
        q: 'Jak dodać nową piekarnię albo zamknąć lokal?',
        a: '„Piekarnie” → „Dodaj”: adres, telefon, kod do numerów rezerwacji (np. „WIL”), położenie na mapie („Uzupełnij z adresu”), godziny i zdjęcia. Strona sama przeliczy liczbę piekarni w tekstach i na mapie. Zamykany lokal usuń z listy – wcześniejsze rezerwacje zostają w historii.',
      },
      {
        q: 'Ktoś zapisał się do newslettera, a nie ma go na liście',
        a: 'Zapis trzeba potwierdzić linkiem z e-maila – do tego czasu osoba ma status „czeka na potwierdzenie” (sprawdź filtr statusu w „Subskrybenci”). Niepotwierdzone zapisy są usuwane automatycznie po 7 dniach. Osobę usuniesz z listy przyciskiem kosza przy jej adresie, a całą listę pobierzesz przyciskiem eksportu.',
      },
    ],
  },
  {
    section: 'Rezerwacje',
    items: [
      {
        q: 'Gdzie zobaczę, co przygotować na jutro?',
        a: '„Do przygotowania” pokazuje zestawienie na wybrany dzień (domyślnie jutro): ile czego przygotować w sumie i w każdym punkcie oraz listę rezerwacji. Zestawienie można wydrukować albo wysłać e-mailem. Codzienną automatyczną wysyłkę (godzina i adresy) włączasz w „Rezerwacje → Zasady rezerwacji”.',
      },
      {
        q: 'Czy mogę zmienić status rezerwacji?',
        a: 'Nie – rezerwacje są tylko do podglądu. Status zmienia wyłącznie klient (anulowanie linkiem z e-maila, do godziny zamknięcia dnia poprzedniego – domyślnie 18:00).',
      },
      {
        q: 'Jak zmienić godzinę zamykania rezerwacji, liczbę dni albo limit na telefon?',
        a: '„Rezerwacje” → „Zasady rezerwacji” (tylko administrator): godzina, do której przyjmujemy rezerwacje i anulowania na następny dzień, ile dni do przodu można rezerwować i ile aktywnych rezerwacji może mieć jeden numer telefonu. Przykład pod polami pokazuje, co zobaczy klient. Zmiana działa od razu – w formularzu, komunikatach, e-mailach, na stronach produktów, w karuzeli i w regulaminie (tam liczby wstawiają się same w miejscu znaczników {godzina}, {dni}, {limit}). Zasady są częścią regulaminu: przy istotnej zmianie zaktualizuj datę „Obowiązuje od” i poinformuj klientów. „Wcześniejsze wersje” i „Przywróć stan domyślny” działają jak w treściach strony.',
      },
      {
        q: 'Co zrobić, gdy usługa płatna (e-maile, mapa, oceny Google) zaczyna dużo kosztować?',
        a: '„Usługi i koszty” (na dole menu, tylko administrator): każdą płatną usługę wyłączysz jednym przełącznikiem, a każda ma też twardy limit dzienny – po jego przekroczeniu wyłącza się sama do północy. Widać tam też dzisiejsze zużycie. Gdy usługa nie działa, strona pokazuje zamiennik: zamiast mapy – listę adresów z linkami do Map Google; bez e-maili rezerwacje dalej działają (klient dostaje numer rezerwacji na ekranie), a zapisy do newslettera i formularz kontaktowy pokazują komunikat; oceny Google zostają z ostatniego odświeżenia. Na pulpicie pojawia się wtedy ostrzeżenie.',
      },
      {
        q: 'Jak zmienić regulamin albo politykę prywatności?',
        a: '„Strona” → „Dokumenty prawne” (tylko administrator): po lewej treść, po prawej podgląd jak na stronie. Składnia: # tytuł, ## rozdział, **pogrubienie**, „1.” albo „-” na początku linii – lista, pusta linia – nowy akapit. Pola w podwójnych nawiasach [[…]] to miejsca do uzupełnienia (np. nazwa firmy, NIP) – panel ostrzega, ile ich zostało. „Zapisz i opublikuj” od razu zmienia dokument na stronie; poprzednie wersje zostają w historii w całości. Wersja startowa to projekt – przed uruchomieniem strony powinien go sprawdzić prawnik.',
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
        a: 'Zdjęcia przeciągnij myszką – pierwsze (oznaczone „Główne”) widać na karcie produktu na stronie. Każde nowe zdjęcie przed dodaniem przytniesz do proporcji 4:5 (patrz „Jak przyciąć zdjęcie?” w „Treści strony”).',
      },
    ],
  },
  {
    section: 'Treści strony',
    items: [
      {
        q: 'Jak zmienić teksty i zdjęcia na stronie głównej?',
        a: '„Strona” → „Strona główna”: sekcje w kolejności jak na stronie. Rozwiń sekcję, zmień teksty lub zdjęcia i kliknij „Zapisz sekcję” – zmiana pojawi się na stronie po kilku sekundach. Licznik przy polu pokazuje limit znaków (dopasowany do miejsca na stronie). Sekcje opcjonalne (opinie Google, cytat, galeria) możesz ukryć przełącznikiem. „Wcześniejsze wersje” pokazuje 10 ostatnich wersji sekcji (kiedy i kto zmienił) – wybraną wersję wczytujesz do formularza. „Przywróć stan domyślny” wczytuje teksty i zdjęcia z dnia uruchomienia strony. W obu przypadkach na stronie nic się nie zmienia, dopóki nie klikniesz „Zapisz sekcję” (a „Cofnij zmiany” wraca do obecnej wersji).',
      },
      {
        q: 'Jak zmienić karuzelę na górze strony głównej?',
        a: '„Strona” → „Strona główna” → zakładka „Karuzela”: slajdy z tytułem, opisem, przyciskami i zdjęciem (osobne zdjęcie na telefon jest opcjonalne). Własne slajdy możesz dodawać, wyłączać, planować („Od” / „Do”) i usuwać. Slajdy Chlebowóz, Piekarnie i Sezonowe pokazują dane z panelu – możesz zmienić ich teksty i wyłączyć je, ale nie usunąć. Kolejność ustalasz liczbą w polu „Kolejność”. Włączonych może być najwyżej 5 slajdów – kolejne trzymaj jako wyłączone w zapasie. W formularzu slajdu są też „Wcześniejsze wersje” i (dla slajdów startowych) „Przywróć stan domyślny”. Każdy slajd musi mieć zdjęcie na komputer – bez niego slajdu nie da się zapisać. Slajd Chlebowóz pokazuje najbliższy przystanek i znika, gdy trasa jest pusta; slajd Piekarnie wstawia liczbę piekarni w miejsce {piekarnie}; slajd Sezonowe pokazuje się tylko wtedy, gdy w ofercie jest dostępny teraz jakiś produkt sezonowy. W tytule i opisie każdego slajdu możesz użyć znaczników {godzina}, {dni} i {limit} – strona wstawi aktualne zasady rezerwacji (np. slajd Rezerwacja: „do {godzina} dnia poprzedniego”).',
      },
      {
        q: 'Jak zmienić teksty na pozostałych stronach, w stopce i w okienku newslettera?',
        a: '„Strona” → „Podstrony”: zakładka dla każdej strony (O nas, Oferta, Piekarnie, Chlebowóz, Aktualności, Kontakt, Rezerwacja) – sekcje działają tak samo jak na stronie głównej. „Strona” → „Podstrony” → zakładka „Elementy wspólne”: stopka, okienko zapisu do newslettera, strona 404 (pokazuje się po wejściu na nieistniejący adres) i domyślne zdjęcie do udostępniania. Niektóre teksty mają znaczniki w nawiasach klamrowych, np. {miejsca} albo {profil} – strona wstawia w ich miejsce aktualne dane (liczbę piekarni, nazwę profilu na Instagramie); opis znacznika jest pod polem. Dane takie jak adresy, godziny, telefony, opis chlebowozu czy produkty zmieniasz dalej w ich zakładkach.',
      },
      {
        q: 'Jak ustawić, jak strona wygląda w Google i na Facebooku (SEO)?',
        a: 'Pierwsza sekcja każdej strony to „Wyszukiwarka i udostępnianie (SEO)”: tytuł i opis w wynikach Google oraz zdjęcie w podglądzie linku (Facebook, Messenger, WhatsApp). Podgląd nad polami pokazuje, jak to będzie wyglądać. Google pokazuje ok. 60 znaków tytułu i ok. 155 znaków opisu – licznik ostrzega, gdy tekst jest dłuższy (dłuższy nie szkodzi, tylko zostanie obcięty). Najważniejsze słowa (np. „chleb na zakwasie Kraków”) dawaj na początek, a każda strona powinna mieć inny tytuł i opis. Bez własnego zdjęcia podgląd linku pokazuje domyślne zdjęcie z „Elementy wspólne”; produkty pokazują swoje zdjęcie, a wpis – okładkę albo zdjęcie z pola „Zdjęcie przy udostępnianiu”. Google odświeża wyniki samo, zwykle w ciągu kilku dni.',
      },
      {
        q: 'Baner o plikach cookie i zgoda na mapę',
        a: '„Podstrony” → „Elementy wspólne” → „Pliki cookie”: włącznik banera, teksty i przyciski. Gdy włączone jest „Mapa Google dopiero po zgodzie”, odwiedzający bez zgody zamiast mapy widzi listę adresów z przyciskiem „Pokaż mapę”, a baner ma przyciski „Akceptuję” i „Tylko niezbędne”. Decyzję można zmienić linkiem „Ustawienia plików cookie” w stopce. Treść banera i to, czy zgoda jest potrzebna, warto ustalić z prawnikiem (razem z polityką prywatności).',
      },
      {
        q: 'Zmieniłem zdjęcie, a Facebook pokazuje stary podgląd linku – co zrobić?',
        a: 'Facebook zapamiętuje podgląd linku na kilka dni. Wejdź na developers.facebook.com/tools/debug (Sharing Debugger, trzeba być zalogowanym na Facebooku), wklej adres strony, np. chlebasmak.pl/o-nas, i kliknij „Scrape Again” (Pobierz ponownie). Po chwili zobaczysz nowy podgląd, a kolejne udostępnienia będą już z nowym zdjęciem. Messenger i WhatsApp korzystają z tej samej pamięci lub odświeżają się same po kilku dniach.',
      },
      {
        q: 'Jakie zdjęcia wgrywać?',
        a: 'Duże, prosto z aparatu lub telefonu – nie zdjęcia zapisane z komunikatora (są zmniejszone i zostaną odrzucone jako za małe). Pod każdym polem zdjęcia widać minimalny rozmiar, np. „min. 800 × 1000 px”. Panel przyjmuje JPG, PNG i WebP do 30 MB; zbyt duże zdjęcia sam zmniejsza i zapisuje jako JPG, więc strona i e-maile ładują się szybko. Opis zdjęcia pomaga osobom niewidomym i Google; zdjęcie czysto ozdobne może zostać bez opisu.',
      },
      {
        q: 'Jak przyciąć zdjęcie?',
        a: 'Po wybraniu zdjęcia otwiera się okno kadrowania z ramką w proporcjach, w jakich zdjęcie pokaże się na stronie: produkt 4:5, wpis 4:3, slajd karuzeli 16:9 (na telefon 3:4), podgląd linku na Facebooku 1200 × 630, zdjęcia w treściach stron – jak przy polu. Przesuń zdjęcie i ustaw suwakiem powiększenie, aż w ramce będzie to, co ma być widać, i kliknij „Przytnij i wgraj”. Pod zdjęciem widać rozmiar wyniku. Gdy zdjęcie jest za małe, panel to napisze i nie pozwoli go wgrać. Zdjęcia piekarni i chlebowozu nie są przycinane (strona pokazuje je w różnych kadrach) – panel tylko pilnuje rozmiaru. Przy zdjęciach w karuzeli dodatkowo wybierz „Kadr” – którą część zdjęcia zawsze pokazywać na różnych ekranach.',
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
        a: '„Chlebowóz” → zakładka „Trasa”: każdy postój to osobny przystanek (dzień, godziny, adres). Jednego dnia może być kilka przystanków – widoczne nie mogą nakładać się godzinami. Dzień bez widocznych przystanków jest na stronie oznaczony „Chlebowóz odpoczywa”. Gdy ten sam przystanek jest w kilka dni, wpisz za każdym razem ten sam adres i położenie.',
      },
      {
        q: 'Trasa chlebowozu się zmienia – usunąć stare przystanki?',
        a: 'Lepiej je ukryć: na liście „Trasa” kliknij „Ukryj” przy przystanku (albo w formularzu wyłącz „Pokazuj na stronie”). Ukryty przystanek znika ze strony, z mapy i z rezerwacji, ale zostaje na liście (przyciemniony) – gdy chlebowóz wróci na starą trasę, kliknij „Pokaż”. Filtr „Widoczność” nad listą pokazuje tylko przystanki na stronie albo tylko ukryte. Usuń przystanek tylko wtedy, gdy na pewno nie wróci.',
      },
      {
        q: 'Ocena piekarni w Google',
        a: 'W formularzu piekarni wpisz „Identyfikator miejsca Google (Place ID)” – na stronie „Piekarnie” pojawi się ocena (gwiazdki i liczba opinii, odświeżane raz dziennie) i link „Oceń nas w Google”. Identyfikator znajdziesz w narzędziu Place ID Finder (link przy polu). W stopce strony pojawia się ocena zbiorcza (średnia ważona liczbą opinii wszystkich piekarni). Gwiazdki wymagają klucza Google w konfiguracji serwera; po jego dodaniu użyj „Odśwież ocenę teraz” w formularzu piekarni.',
      },
      {
        q: 'Punkt nie pojawia się na mapie',
        a: 'Brakuje położenia. W formularzu piekarni lub przystanku kliknij „Uzupełnij z adresu” (albo wpisz współrzędne ręcznie) i zapisz.',
      },
    ],
  },
  {
    section: 'Korzystanie z panelu',
    items: [
      {
        q: 'Jak ukryć panel, którego nie używam, na pulpicie albo w statystykach?',
        a: 'Kliknij ikonę oka w nagłówku panelu – zwinie się do paska z samym nagłówkiem i przekreślonym okiem. Kliknięcie paska pokazuje panel z powrotem. Ustawienie zapamiętuje przeglądarka, osobno dla każdego konta (zostaje po wylogowaniu; na innym komputerze lub w innej przeglądarce panele są widoczne).',
      },
      {
        q: 'Jak wrócić z edycji do listy?',
        a: 'Strzałka w lewo w górnym pasku z nazwą listy, np. w edycji produktu „← Produkty”, w szczegółach rezerwacji „← Rezerwacje”. Na ekranach otwieranych z menu strzałki nie ma – przejdź wtedy przez menu po lewej.',
      },
      {
        q: 'Wyskoczyło okienko „Niezapisane zmiany” – co to znaczy?',
        a: 'Zmieniłeś coś w formularzu i próbujesz przejść gdzie indziej (menu, strzałka, inna zakładka) bez kliknięcia „Zapisz”. „Zostań i zapisz” wraca do formularza ze zmianami – wtedy kliknij „Zapisz”. „Wyjdź bez zapisywania” porzuca zmiany. Przeglądarka zapyta też przy zamykaniu lub odświeżaniu karty. Po zapisaniu okienko się nie pojawia.',
      },
      {
        q: 'Skąd się biorą „Szybkie akcje” na pulpicie?',
        a: 'Panel zapamiętuje (w przeglądarce, osobno dla każdego konta), które ekrany otwierasz najczęściej – z pulpitu albo z menu – i pokazuje 5 z nich jako szybkie akcje, plus link do strony piekarni. Na początku to zestaw domyślny; z czasem dopasowuje się sam.',
      },
      {
        q: 'Czy panel działa na telefonie?',
        a: 'Tak – listy (produkty, rezerwacje, wpisy, baner, karuzela i inne) na telefonie wyświetlają się jako karty z najważniejszymi informacjami, a formularze mają pola na całą szerokość. Najwygodniej pracuje się jednak na komputerze, zwłaszcza przy dłuższych tekstach i dokumentach prawnych. Podglądy (baner, slajd karuzeli, e-mail newslettera) mają przełącznik „Komputer | Telefon” – na każdym urządzeniu zobaczysz, jak treść wygląda u klientów na komputerze i na telefonie.',
      },
      {
        q: 'Jak przełączyć tryb jasny i ciemny?',
        a: 'Ikona w prawym górnym rogu: słońce (w trybie ciemnym) włącza tryb jasny, księżyc (w trybie jasnym) – ciemny. Wybór jest zapamiętywany.',
      },
    ],
  },
  {
    section: 'Konta i hasła',
    items: [
      {
        q: 'Kto ma dostęp do czego?',
        a: 'Administrator widzi wszystko, w tym rezerwacje z danymi klientów, zasady rezerwacji, dokumenty prawne i konta. Konto „Marketing” edytuje produkty, piekarnie, chlebowóz, treści strony, aktualności i newsletter, subskrybenci, baner i media społecznościowe oraz widzi statystyki odwiedzin (skąd przychodzi ruch, najczęściej odwiedzane strony) – bez dostępu do rezerwacji, kosztów i ustawień.',
      },
      {
        q: 'Jak zmienić swoje hasło?',
        a: 'Kliknij ikonę konta w prawym górnym rogu → „Moje konto”. Nowe hasło musi mieć co najmniej 10 znaków, małą i wielką literę, cyfrę i znak specjalny (np. „Chleb-na-zakwasie7!”) – pod polem widać, które wymagania są już spełnione. Po zmianie inne urządzenia zostaną wylogowane. Wymagania dotyczą nowych haseł; dotychczasowe działają do pierwszej zmiany.',
      },
      {
        q: 'Nie pamiętam hasła',
        a: 'Na ekranie logowania kliknij „Nie pamiętam hasła” i wpisz login albo adres e-mail konta. Na adres przypisany do konta przyjdzie link do ustawienia nowego hasła – działa 30 minut i tylko raz (sprawdź też „Spam”). Po zmianie wszystkie wcześniejsze logowania wygasają, a na skrzynkę przychodzi potwierdzenie. Działa tylko, gdy konto ma wpisany e-mail – inaczej administrator ustawia nowe hasło w „Konta” → wybierz osobę → „Nowe hasło”. Gdy administrator nie ma dostępu do swojej skrzynki, osoba opiekująca się serwerem może zresetować hasło poleceniem awaryjnym.',
      },
      {
        q: 'Jak ustawić e-mail do odzyskiwania hasła?',
        a: 'Administrator: „Konta” → wybierz osobę → pole „E-mail do odzyskiwania hasła” → „Zapisz”. Dla konta administratora najlepiej Gmail piekarni (ten, na którym jest wizytówka w Mapach Google). Lista kont pokazuje, kto nie ma adresu, a „Moje konto” ostrzega, gdy Twoje konto go nie ma. Jeden adres może być przypisany tylko do jednego konta.',
      },
      {
        q: 'Zbyt wiele nieudanych prób logowania',
        a: 'Po kilku błędnych hasłach logowanie na to konto blokuje się na chwilę (od 30 sekund do 15 minut) – to ochrona przed zgadywaniem hasła. Poczekaj albo użyj „Nie pamiętam hasła”: ustawienie nowego hasła od razu zdejmuje blokadę.',
      },
    ],
  },
  {
    section: 'Marketing i komunikacja',
    items: [
      {
        q: 'Gdzie zobaczę, co teraz trwa i co jest zaplanowane?',
        a: 'Na „Pulpicie”, w sekcji „Marketing”: trwające i zaplanowane promocje, zaplanowane wpisy i newslettery, zaplanowane zmiany w ofercie („Dostępny od / Niedostępny od”), etykiety z datami, które w ciągu 14 dni się zaczynają lub kończą, oraz skrót wyników – wejścia z ostatniego newslettera i najczęściej oglądane produkty z ostatnich 7 dni. Kliknięcie pozycji otwiera jej formularz.',
      },
      {
        q: 'Jak wysłać newsletter?',
        a: 'Newsletterem są wpisy w „Aktualności i newsletter”. Przy zapisie wpisu z włączoną opcją „Wyślij jako newsletter” panel poprosi o potwierdzenie i wyśle wpis do potwierdzonych subskrybentów – tylko raz. Wyłącz „Opublikuj na stronie”, aby wysłać wpis tylko e-mailem. „Podgląd e-maila” pod treścią pokazuje, jak wpis zobaczą subskrybenci – bez wysyłania.',
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
        q: 'Jak pokazać posty z Instagrama na stronie?',
        a: '„Marketing” → „Instagram”: jednorazowo wklej klucz dostępu z konta piekarni (instrukcja krok po kroku jest na tym ekranie) i kliknij „Zapisz i połącz”. Ostatnie posty pojawią się na stronie głównej i w kontakcie; strona sprawdza nowe co 3 godziny, a klucz odnawia sama. Gdy połączenie przestanie działać (np. zmiana hasła do Instagrama), sekcja na stronie sama się ukryje, a na tym ekranie zobaczysz, co się stało. Tytuł i napis przycisku – „Podstrony” → „Elementy wspólne”.',
      },
      {
        q: 'Jak dodać komunikat na pasku pod menu strony?',
        a: '„Baner informacyjny” → „Dodaj”: krótka treść, opcjonalnie przycisk z linkiem (np. do wpisu lub okienka zapisu do newslettera) i okres wyświetlania. Po dacie „Do” komunikat znika sam.',
      },
    ],
  },
];

// wyszukiwanie bez rozróżniania wielkości liter i polskich znaków
const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l');

/** Karta „Pomoc techniczna” – kontakt do wykonawcy strony */
const SupportCard = () => {
  const filled = SUPPORT.name || SUPPORT.phone || SUPPORT.email;
  return (
    <Paper variant="outlined" sx={{ p: 2.5, mb: 3, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <SupportAgentIcon color="primary" sx={{ mt: 0.25 }} />
      <Box>
        <Typography fontWeight={700}>Pomoc techniczna</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Gdy coś nie działa albo nie znajdziesz odpowiedzi poniżej – skontaktuj się z osobą, która opiekuje się stroną.
        </Typography>
        {filled ? (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.5, sm: 3 }} sx={{ mt: 1.25 }}>
            {SUPPORT.name && <Typography variant="body2">{SUPPORT.name}</Typography>}
            {SUPPORT.phone && (
              <Link href={`tel:${SUPPORT.phone.replace(/\s/g, '')}`} variant="body2">
                {SUPPORT.phone}
              </Link>
            )}
            {SUPPORT.email && (
              <Link href={`mailto:${SUPPORT.email}`} variant="body2">
                {SUPPORT.email}
              </Link>
            )}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25, fontStyle: 'italic' }}>
            Dane kontaktowe zostaną uzupełnione przy uruchomieniu strony.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

const HelpPage = () => {
  const [query, setQuery] = useState('');
  // dłuższe słowa bez ostatniej litery – „haslo” znajdzie też „hasła”, „zdjecie” – „zdjęcia”
  const words = normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.length >= 5 ? w.slice(0, -1) : w));
  const matches = (q: string, a: string) => {
    const text = normalize(`${q} ${a}`);
    return words.every((w) => text.includes(w));
  };
  const visible = TOPICS.map(({ section, items }) => ({
    section,
    items: items.filter(({ q, a }) => matches(q, a)),
  })).filter(({ items }) => items.length > 0);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: { xs: 2, md: 4 } }}>
      <Title title="Pomoc" />
      <Typography variant="overline" color="primary">
        Pomoc
      </Typography>
      <Typography variant="h4" sx={{ mt: 0.5, mb: 1 }}>
        Jak korzystać z panelu
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Zmiany zapisane w panelu pojawiają się na stronie po kilku sekundach. Po zapisaniu przez ok. 5 sekund możesz je
        cofnąć przyciskiem „Cofnij”.
      </Typography>

      <SupportCard />

      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj w pomocy, np. hasło, zdjęcie, newsletter"
        fullWidth
        size="small"
        sx={{ mb: 3 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
      {visible.length === 0 && (
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Nic nie znaleziono – spróbuj innego słowa albo skontaktuj się z pomocą techniczną.
        </Typography>
      )}

      {visible.map(({ section, items }) => (
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
        Brak odpowiedzi na Twoje pytanie? Skontaktuj się z pomocą techniczną (na górze tej strony).
      </Typography>
    </Box>
  );
};

export default HelpPage;
