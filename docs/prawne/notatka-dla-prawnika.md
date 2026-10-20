# Chleba Smak – serwis rezerwacji pieczywa: notatka dla prawnika

Przygotowano: [[DATA]] · Autor (wykonawca serwisu): [[IMIĘ I NAZWISKO / FIRMA WYKONAWCY]]

Notatka opisuje, jak technicznie działa serwis i jakie dane przetwarza, aby ułatwić weryfikację projektów dwóch dokumentów:
- **Regulamin rezerwacji**: wersja startowa `backend/content/prawne/regulamin-rezerwacji.md` (na stronie `/regulamin`),
- **Polityka prywatności**: wersja startowa `backend/content/prawne/polityka-prywatnosci.md` (na stronie `/polityka-prywatnosci`).

Właściciel może zmieniać oba dokumenty w panelu (Ustawienia → Dokumenty prawne; pełna historia wersji). Liczby z zasad rezerwacji (godzina zamknięcia, liczba dni, limit na telefon) są w dokumentach znacznikami `{godzina}`, `{dni}`, `{limit}` – strona wstawia aktualne wartości ustawione w panelu.

Miejsca wymagające uzupełnienia lub decyzji oznaczono w dokumentach jako `[[…]]`.

---

## 1. Opis usługi

- Sieć 4 piekarni rzemieślniczych w Krakowie i pojazd sprzedażowy („Chlebowóz”) z tygodniowym harmonogramem postojów.
- Serwis internetowy: prezentacja oferty, lokalizacji i harmonogramu Chlebowozu oraz **rezerwacja pieczywa z odbiorem osobistym**.
- **Brak płatności online.** Płatność wyłącznie przy odbiorze (gotówka lub karta), paragon z kasy fiskalnej w punkcie.
- **Brak kont klientów.** Klient nie zakłada konta ani nie loguje się.
- Panel administracyjny dostępny wyłącznie dla pracowników (indywidualne konta z rolami).

## 2. Proces rezerwacji (krok po kroku)

1. Klient wybiera produkty i ilości. Lista zapisuje się w pamięci przeglądarki (localStorage) i nie trafia na serwer do chwili wysłania formularza.
2. Klient wybiera punkt odbioru (piekarnia albo przystanek Chlebowozu) oraz termin:
   - rezerwacja na dany dzień możliwa do **18:00 dnia poprzedniego**, najdalej **5 dni do przodu**,
   - kolejność: dzień → punkt odbioru (piekarnia lub przystanek Chlebowozu, wybór na minimapie Google lub liście) → szacowana godzina odbioru co 30 min (piekarnia: w godzinach otwarcia, Chlebowóz: w czasie postoju).
3. Klient podaje **imię, numer telefonu, adres e-mail**, opcjonalnie uwagi, i zaznacza checkbox: *„Akceptuję regulamin rezerwacji i zapoznałem/-am się z polityką prywatności”*. Nie jest to zgoda w rozumieniu art. 6 ust. 1 lit. a RODO. Podstawą przetwarzania jest art. 6 ust. 1 lit. b.
4. Serwer weryfikuje zasady (terminy, dostępność produktów, limit **3 aktywnych rezerwacji na jeden numer telefonu**, ukryte pole antyspamowe), nadaje numer (np. `WIL-261017-03`: kod punktu, data odbioru RRMMDD, kolejny numer) i zapisuje rezerwację.
5. Klient dostaje **e-mail z potwierdzeniem**: numer, punkt i termin, produkty, ceny, kwota do zapłaty, telefon punktu, link nawigacji, link do anulowania, linki do regulaminu i polityki prywatności. E-mail nie zawiera pikseli śledzących. Czcionki pobierane są z serwera administratora, nie z Google.
6. **Anulowanie** przez klienta: link z e-maila (unikalny, losowy token), do 18:00 dnia poprzedniego. Potwierdzenie anulowania e-mailem.
7. Pracownicy widzą rezerwacje w panelu (lista tylko do odczytu, statusy: **przyjęta** i **anulowana** – status zmienia wyłącznie klient linkiem z e-maila; obsługa nie edytuje rezerwacji) oraz zestawienie „do przygotowania” na dany dzień. Zestawienie może być wysyłane e-mailem na wewnętrzny adres piekarni. Automatyczna wysyłka o 18:30 jest przygotowana, decyzja o włączeniu należy do właściciela.

## 3. Inwentaryzacja danych osobowych

| Kategoria | Dane | Skąd | Gdzie przechowywane | Kto ma dostęp | Okres |
|---|---|---|---|---|---|
| Rezerwacje | imię, telefon, e-mail, uwagi (opcjonalne), produkty, punkt, termin, status, data złożenia | formularz | baza danych MySQL na serwerze hostingu | upoważnieni pracownicy (panel), wykonawca IT (utrzymanie) | **6 miesięcy od złożenia rezerwacji**, potem automatyczna anonimizacja (codziennie o 3:00) (usunięcie imienia, telefonu, e-maila, uwag; produkty/daty/punkt zostają do statystyk) |
| E-maile transakcyjne | adres e-mail, treść potwierdzenia | system | dostawca wysyłki e-mail | dostawca (podmiot przetwarzający) | wg ustawień dostawcy [[do ustalenia]] |
| Logi serwera | adres IP, czas, adres podstrony, przeglądarka | automatycznie | serwer hostingu | hosting, wykonawca IT | [[do ustalenia, np. 30 dni]] |
| Wiadomości z formularza kontaktowego | imię, e-mail, temat, treść | formularz „Kontakt” | wyłącznie skrzynka e-mail piekarni (nie w bazie); adres IP tylko w pamięci serwera przez 15 min (limit wysyłek) | osoby obsługujące skrzynkę | [[do ustalenia, np. 12 miesięcy]] |
| Newsletter | e-mail, status (oczekuje / potwierdzony / wypisany), daty zgody, potwierdzenia, wypisania, losowy token do linków | okienko „Newsletter” na stronie (pasek komunikatów, stopka, Kontakt) | baza danych | administrator, osoby z dostępem do panelu (lista + eksport CSV) | do wypisania; niepotwierdzone – automatycznie usuwane po 7 dniach; po wypisaniu [[do ustalenia]] |
| Koszyk rezerwacji | identyfikatory i ilości produktów | przeglądarka klienta | localStorage w przeglądarce klienta (nie na serwerze) | tylko klient | do wyczyszczenia przez klienta lub złożenia rezerwacji |
| Mapa Google | adres IP, podstrona, dane przeglądarki | automatycznie przy wyświetleniu mapy | serwery Google | Google | wg Google |
| Konta pracowników | login, hasło (zahaszowane bcrypt), rola | administrator | baza danych | administrator | do czasu usunięcia konta |

Dodatkowo:
- Pracownik może w panelu użyć przycisku **„Usuń dane klienta”**, który działa jak anonimizacja, ale natychmiast. Służy do obsługi żądań z art. 17 RODO.
- Formularz kontaktowy wysyła wiadomość e-mailem na skrzynkę piekarni (zob. pkt 5.15).
- **Brak** zewnętrznej analityki (Google Analytics itp.), pikseli reklamowych i wtyczek mediów społecznościowych. Newsletter – zob. pkt 5.16.
- **Własne anonimowe statystyki** (panel „Statystyki”, polityka pkt 2.3): dzienne liczniki odsłon podstron (ścieżki bez identyfikatorów, np. „strony produktów”), wczytań mapy Google i wysłanych e-maili. Bez cookies i bez zapisywania IP; adres IP tylko chwilowo w pamięci serwera do limitu zdarzeń (300 / 10 min z jednego adresu). Pytanie: czy przy takim zakresie wystarczy informacja w polityce prywatności (założenie: brak danych osobowych w zapisanych statystykach, brak dostępu do urządzenia użytkownika w rozumieniu art. 399 Prawa komunikacji elektronicznej poza samym wysłaniem żądania przez stronę).

## 4. Podmioty zewnętrzne

| Podmiot | Rola (wstępnie) | Lokalizacja | Wymagane działania |
|---|---|---|---|
| Hosting serwera i bazy danych: [[do wyboru]] | podmiot przetwarzający | [[UE / poza UE]] | umowa powierzenia (DPA) |
| Wysyłka e-mail: [[np. Resend, Inc.]] | podmiot przetwarzający | USA | DPA + podstawa transferu (DPF / SCC) |
| Google (Maps JavaScript API) | [[do oceny: odrębny administrator / podmiot przetwarzający]] | UE / USA | akceptacja warunków Google Maps Platform, informacja w polityce |
| Wykonawca IT (utrzymanie serwisu) | podmiot przetwarzający | Polska | umowa powierzenia |
| Meta (Instagram, Facebook – wiadomości prywatne) | [[do oceny: odrębny administrator / współadministrowanie]] | UE / USA | informacja w polityce (pkt 2.5), zob. pkt 5.14 |

## 5. Kwestie do weryfikacji przez prawnika

1. **Charakter prawny rezerwacji** (regulamin § 5 ust. 8 i § 11). Przyjęto konstrukcję: rezerwacja to zobowiązanie piekarni do przygotowania i odłożenia produktów, a umowa sprzedaży jest zawierana stacjonarnie przy odbiorze i zapłacie. Pytania:
   - czy konstrukcja jest prawidłowa i bezpieczna,
   - czy alternatywnie nie należy traktować rezerwacji jako umowy zawartej na odległość,
   - czy w takim przypadku wystarczy powołanie wyłączenia z art. 38 ust. 1 pkt 4 ustawy o prawach konsumenta (rzeczy szybko psujące się) i jakie dodatkowe obowiązki informacyjne by z tego wynikały.
2. **Cena** (regulamin § 6 ust. 2). System zapamiętuje cenę z chwili rezerwacji. Do decyzji: czy jest wiążąca przy odbiorze.
3. **Nieodebrane rezerwacje** (regulamin § 7 ust. 2–3). Do decyzji: do kiedy rezerwacja czeka na odbiór. System **nie rejestruje odbioru** (tylko statusy przyjęta/anulowana), więc ewentualna odmowa przyjmowania rezerwacji osobom, które ich nie odbierają, wymagałaby ręcznej weryfikacji przez obsługę. Regulamin § 9: anulowanie przez piekarnię odbywa się telefonicznie lub e-mailowo, a w systemie rezerwacja pozostaje „przyjęta”.
4. **Podstawa prawna limitu 3 aktywnych rezerwacji na numer telefonu** (prawnie uzasadniony interes, art. 6 ust. 1 lit. f) i ocena, czy nie stanowi to zautomatyzowanego podejmowania decyzji w rozumieniu art. 22 RODO (polityka pkt 8). Założenie: nie, bo nie wywołuje istotnych skutków.
5. **Okres przechowywania: 6 miesięcy od złożenia rezerwacji** (polityka pkt 6). Czy jest adekwatny wobec terminów reklamacji (rękojmia, niezgodność towaru z umową) i przedawnienia roszczeń, czy należy go wydłużyć albo skrócić. Wartość jest konfigurowalna jednym parametrem.
6. **Mapa Google ładowana automatycznie** na podstronach „Piekarnie” i „Chlebowóz”. Wyświetlenie mapy przekazuje adres IP do Google bez uprzedniej akcji użytkownika. Właściciel świadomie zrezygnował z rozwiązania „mapa po kliknięciu”. Prosimy o ocenę ryzyka i właściwej podstawy prawnej (por. wyrok LG München I z 20.01.2022, 3 O 17493/20, dotyczący Google Fonts). Alternatywa techniczna jest łatwa do wdrożenia, gdyby prawnik ją zalecił.
7. **Rola Google** przy Google Maps Platform i podmiot świadczący usługę dla klientów z EOG.
8. **Transfery do USA**: weryfikacja certyfikacji Data Privacy Framework wybranego dostawcy e-mail i ewentualnie hostingu.
9. **Pamięć przeglądarki**: localStorage na koszyk rezerwacji i punkt odbioru z ostatniej rezerwacji (zaznaczany przy kolejnej) oraz sessionStorage na informację o zamknięciu komunikatu na banerze pod menu (znika po zamknięciu karty). Żadne z nich nie trafia na serwer. Założenie: wyjątek z art. 399 ust. 3 Prawa komunikacji elektronicznej (przechowywanie niezbędne do świadczenia usługi żądanej przez użytkownika), więc baner zgody nie jest wymagany.
10. **Pozasądowe rozwiązywanie sporów** (regulamin § 12). Unijna platforma ODR zakończyła działalność w 2025 r., dlatego nie zamieszczono do niej odnośnika. Prosimy o weryfikację aktualnych wymogów informacyjnych.
11. **Inspektor ochrony danych**: założenie, że wyznaczenie nie jest obowiązkowe (art. 37 RODO).
12. **Rejestr czynności przetwarzania** (art. 30 RODO): czy przy tej skali przetwarzania jest wymagany. Rekomendacja wykonawcy: prowadzić. Inwentaryzacja z pkt 3 może posłużyć za podstawę.
13. **Treść zgody/akceptacji w formularzu**: czy obecne brzmienie checkboxa (pkt 2.3 powyżej) jest prawidłowe.
14. **Kontakt przez wiadomości na Instagramie / Facebooku** (polityka pkt 2.2 i 2.5). Na stronie „Kontakt” jest link otwierający okno wiadomości na Instagramie (ig.me). Piekarnia prowadzi profile tylko na Instagramie i Facebooku. Prosimy o ocenę roli Meta (odrębny administrator czy współadministrowanie w zakresie profilu, por. wyrok TSUE C-210/16 Wirtschaftsakademie) i treści informacji w polityce.
15. **Formularz kontaktowy** (polityka pkt 2.2). Pola: imię, e-mail, temat (opcjonalnie), treść. Wiadomość nie jest zapisywana w bazie – trafia wyłącznie e-mailem na skrzynkę piekarni (z ustawionym „Odpowiedz do” na adres nadawcy). Pod formularzem jest krótka informacja z linkiem do polityki (bez checkboxa – podstawa art. 6 ust. 1 lit. f). Ochrona przed nadużyciami: ukryte pole na boty i limit wiadomości z jednego adresu IP (adres IP trzymany tylko w pamięci serwera przez 15 minut). Do potwierdzenia: okres przechowywania korespondencji (polityka pkt 6 – obecnie „[[np. 12 miesięcy]]”).
16. **Newsletter** (polityka pkt 2.6, 6, 7). Zapis w okienku: e-mail + checkbox zgody (niezaznaczony domyślnie) z treścią: *„Chcę otrzymywać newsletter Chleba Smak na podany adres e-mail. Zgodę mogę wycofać w każdej chwili – link do wypisania jest w każdej wiadomości. Więcej w polityce prywatności.”* Podwójne potwierdzenie (double opt-in): e-mail z linkiem, zapis aktywny dopiero po kliknięciu przycisku na stronie (nie przy samym otwarciu linku – skanery poczty). Zapisywane są daty zgody, potwierdzenia i wypisania; niepotwierdzone zapisy są usuwane po 7 dniach. Pytania: (a) czy treść zgody spełnia wymogi RODO i art. 398 Prawa komunikacji elektronicznej, (b) jak długo przechowywać adres i daty po wypisaniu jako dowód zgody, (c) wysyłka: newsletterem są wpisy z bloga – przy zapisaniu wpisu z zaznaczoną opcją „Wyślij jako newsletter” system wysyła go (jednorazowo) do potwierdzonych subskrybentów przez tego samego dostawcę e-mail co potwierdzenia rezerwacji; każda wiadomość ma link „Wypisz się” i nagłówek List-Unsubscribe. Czy to wymaga dodatkowych zapisów w umowie powierzenia z dostawcą e-mail?
17. **Lokalizacja klienta – przycisk „Najbliżej mnie”** w formularzu rezerwacji (polityka pkt 2.4). Przeglądarka pyta o zgodę na lokalizację; współrzędne są używane tylko w przeglądarce do sortowania punktów i wyśrodkowania minimapy, nie są zapisywane ani wysyłane na nasz serwer (Google pobiera jedynie fragment mapy w tej okolicy). Pytanie: czy wystarczy zgoda w oknie przeglądarki i informacja w polityce, czy potrzebna jest osobna zgoda/informacja na stronie.

## 6. Obowiązki organizacyjne po stronie właściciela (do zapewnienia przed startem)

- [ ] Uzupełnienie danych firmy w obu dokumentach.
- [ ] Umowy powierzenia z hostingiem, dostawcą e-mail i wykonawcą IT.
- [ ] Upoważnienia do przetwarzania danych i zobowiązania do poufności dla pracowników z dostępem do panelu.
- [ ] Rejestr czynności przetwarzania (zalecany).
- [ ] Procedura obsługi żądań osób (dostęp, usunięcie, sprzeciw) – w panelu dostępny przycisk „Usuń dane klienta”.
- [ ] Procedura postępowania przy naruszeniu ochrony danych (zgłoszenie do UODO w ciągu 72 godzin, art. 33 RODO).
- [ ] Zmiana domyślnych haseł kont pracowników, indywidualne konta zamiast wspólnych, HTTPS na domenie, kopie zapasowe bazy.
- [ ] Publikacja zatwierdzonych dokumentów w Serwisie (strony `/regulamin` i `/polityka-prywatnosci` są gotowe i pobierają treść z plików wymienionych na początku notatki).
