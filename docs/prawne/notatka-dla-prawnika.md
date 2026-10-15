# Chleba Smak – serwis rezerwacji pieczywa: notatka dla prawnika

Przygotowano: [[DATA]] · Autor (wykonawca serwisu): [[IMIĘ I NAZWISKO / FIRMA WYKONAWCY]]

Notatka opisuje, jak technicznie działa serwis i jakie dane przetwarza, aby ułatwić weryfikację projektów dwóch dokumentów:
- **Regulamin rezerwacji**: `web/content/prawne/regulamin-rezerwacji.md` (na stronie `/regulamin`),
- **Polityka prywatności**: `web/content/prawne/polityka-prywatnosci.md` (na stronie `/polityka-prywatnosci`).

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
   - w piekarni godzina odbioru w godzinach otwarcia (co 30 min), dla Chlebowozu przedział postoju.
3. Klient podaje **imię, numer telefonu, adres e-mail**, opcjonalnie uwagi, i zaznacza checkbox: *„Akceptuję regulamin rezerwacji i zapoznałem/-am się z polityką prywatności”*. Nie jest to zgoda w rozumieniu art. 6 ust. 1 lit. a RODO. Podstawą przetwarzania jest art. 6 ust. 1 lit. b.
4. Serwer weryfikuje zasady (terminy, dostępność produktów, limit **3 aktywnych rezerwacji na jeden numer telefonu**, ukryte pole antyspamowe), nadaje numer (np. `WIL-1017-03`) i zapisuje rezerwację.
5. Klient dostaje **e-mail z potwierdzeniem**: numer, punkt i termin, produkty, ceny, kwota do zapłaty, telefon punktu, link nawigacji, link do anulowania, linki do regulaminu i polityki prywatności. E-mail nie zawiera pikseli śledzących. Czcionki pobierane są z serwera administratora, nie z Google.
6. **Anulowanie** przez klienta: link z e-maila (unikalny, losowy token), do 18:00 dnia poprzedniego. Potwierdzenie anulowania e-mailem.
7. Pracownicy widzą rezerwacje w panelu (lista, statusy: przyjęta, gotowa, odebrana, nieodebrana, anulowana) oraz zestawienie „do przygotowania” na dany dzień. Zestawienie może być wysyłane e-mailem na wewnętrzny adres piekarni. Automatyczna wysyłka o 18:30 jest przygotowana, decyzja o włączeniu należy do właściciela.

## 3. Inwentaryzacja danych osobowych

| Kategoria | Dane | Skąd | Gdzie przechowywane | Kto ma dostęp | Okres |
|---|---|---|---|---|---|
| Rezerwacje | imię, telefon, e-mail, uwagi (opcjonalne), produkty, punkt, termin, status, data złożenia | formularz | baza danych MySQL na serwerze hostingu | upoważnieni pracownicy (panel), wykonawca IT (utrzymanie) | **183 dni od dnia odbioru**, potem automatyczna anonimizacja (usunięcie imienia, telefonu, e-maila, uwag; produkty/daty/punkt zostają do statystyk) |
| E-maile transakcyjne | adres e-mail, treść potwierdzenia | system | dostawca wysyłki e-mail | dostawca (podmiot przetwarzający) | wg ustawień dostawcy [[do ustalenia]] |
| Logi serwera | adres IP, czas, adres podstrony, przeglądarka | automatycznie | serwer hostingu | hosting, wykonawca IT | [[do ustalenia, np. 30 dni]] |
| Koszyk rezerwacji | identyfikatory i ilości produktów | przeglądarka klienta | localStorage w przeglądarce klienta (nie na serwerze) | tylko klient | do wyczyszczenia przez klienta lub złożenia rezerwacji |
| Mapa Google | adres IP, podstrona, dane przeglądarki | automatycznie przy wyświetleniu mapy | serwery Google | Google | wg Google |
| Konta pracowników | login, hasło (zahaszowane bcrypt), rola | administrator | baza danych | administrator | do czasu usunięcia konta |

Dodatkowo:
- Pracownik może w panelu użyć przycisku **„Usuń dane klienta”**, który działa jak anonimizacja, ale natychmiast. Służy do obsługi żądań z art. 17 RODO.
- Formularz kontaktowy na stronie **nie wysyła obecnie wiadomości**. Jeśli zostanie uruchomiony, trzeba będzie zaktualizować pkt 2.2 polityki.
- **Brak** analityki (Google Analytics itp.), pikseli reklamowych, wtyczek mediów społecznościowych i newslettera.

## 4. Podmioty zewnętrzne

| Podmiot | Rola (wstępnie) | Lokalizacja | Wymagane działania |
|---|---|---|---|
| Hosting serwera i bazy danych: [[do wyboru]] | podmiot przetwarzający | [[UE / poza UE]] | umowa powierzenia (DPA) |
| Wysyłka e-mail: [[np. Resend, Inc.]] | podmiot przetwarzający | USA | DPA + podstawa transferu (DPF / SCC) |
| Google (Maps JavaScript API) | [[do oceny: odrębny administrator / podmiot przetwarzający]] | UE / USA | akceptacja warunków Google Maps Platform, informacja w polityce |
| Wykonawca IT (utrzymanie serwisu) | podmiot przetwarzający | Polska | umowa powierzenia |

## 5. Kwestie do weryfikacji przez prawnika

1. **Charakter prawny rezerwacji** (regulamin § 5 ust. 8 i § 11). Przyjęto konstrukcję: rezerwacja to zobowiązanie piekarni do przygotowania i odłożenia produktów, a umowa sprzedaży jest zawierana stacjonarnie przy odbiorze i zapłacie. Pytania:
   - czy konstrukcja jest prawidłowa i bezpieczna,
   - czy alternatywnie nie należy traktować rezerwacji jako umowy zawartej na odległość,
   - czy w takim przypadku wystarczy powołanie wyłączenia z art. 38 ust. 1 pkt 4 ustawy o prawach konsumenta (rzeczy szybko psujące się) i jakie dodatkowe obowiązki informacyjne by z tego wynikały.
2. **Cena** (regulamin § 6 ust. 2). System zapamiętuje cenę z chwili rezerwacji. Do decyzji: czy jest wiążąca przy odbiorze.
3. **Nieodebrane rezerwacje** (regulamin § 7 ust. 2–3). Do decyzji: do kiedy rezerwacja czeka i czy oraz na jakich zasadach odmawiać kolejnych rezerwacji osobom notorycznie ich nieodbierającym. Funkcja blokady nie jest jeszcze zaimplementowana i zostanie dodana zgodnie z decyzją.
4. **Podstawa prawna limitu 3 aktywnych rezerwacji na numer telefonu** (prawnie uzasadniony interes, art. 6 ust. 1 lit. f) i ocena, czy nie stanowi to zautomatyzowanego podejmowania decyzji w rozumieniu art. 22 RODO (polityka pkt 8). Założenie: nie, bo nie wywołuje istotnych skutków.
5. **Okres przechowywania 183 dni** (polityka pkt 6). Czy jest adekwatny wobec terminów reklamacji (rękojmia, niezgodność towaru z umową) i przedawnienia roszczeń, czy należy go wydłużyć albo skrócić. Wartość jest konfigurowalna jednym parametrem.
6. **Mapa Google ładowana automatycznie** na podstronach „Piekarnie” i „Chlebowóz”. Wyświetlenie mapy przekazuje adres IP do Google bez uprzedniej akcji użytkownika. Właściciel świadomie zrezygnował z rozwiązania „mapa po kliknięciu”. Prosimy o ocenę ryzyka i właściwej podstawy prawnej (por. wyrok LG München I z 20.01.2022, 3 O 17493/20, dotyczący Google Fonts). Alternatywa techniczna jest łatwa do wdrożenia, gdyby prawnik ją zalecił.
7. **Rola Google** przy Google Maps Platform i podmiot świadczący usługę dla klientów z EOG.
8. **Transfery do USA**: weryfikacja certyfikacji Data Privacy Framework wybranego dostawcy e-mail i ewentualnie hostingu.
9. **Pamięć przeglądarki (localStorage)** na koszyk rezerwacji. Założenie: wyjątek z art. 399 ust. 3 Prawa komunikacji elektronicznej (przechowywanie niezbędne do świadczenia usługi żądanej przez użytkownika), więc baner zgody nie jest wymagany.
10. **Pozasądowe rozwiązywanie sporów** (regulamin § 12). Unijna platforma ODR zakończyła działalność w 2025 r., dlatego nie zamieszczono do niej odnośnika. Prosimy o weryfikację aktualnych wymogów informacyjnych.
11. **Inspektor ochrony danych**: założenie, że wyznaczenie nie jest obowiązkowe (art. 37 RODO).
12. **Rejestr czynności przetwarzania** (art. 30 RODO): czy przy tej skali przetwarzania jest wymagany. Rekomendacja wykonawcy: prowadzić. Inwentaryzacja z pkt 3 może posłużyć za podstawę.
13. **Treść zgody/akceptacji w formularzu**: czy obecne brzmienie checkboxa (pkt 2.3 powyżej) jest prawidłowe.

## 6. Obowiązki organizacyjne po stronie właściciela (do zapewnienia przed startem)

- [ ] Uzupełnienie danych firmy w obu dokumentach.
- [ ] Umowy powierzenia z hostingiem, dostawcą e-mail i wykonawcą IT.
- [ ] Upoważnienia do przetwarzania danych i zobowiązania do poufności dla pracowników z dostępem do panelu.
- [ ] Rejestr czynności przetwarzania (zalecany).
- [ ] Procedura obsługi żądań osób (dostęp, usunięcie, sprzeciw) – w panelu dostępny przycisk „Usuń dane klienta”.
- [ ] Procedura postępowania przy naruszeniu ochrony danych (zgłoszenie do UODO w ciągu 72 godzin, art. 33 RODO).
- [ ] Zmiana domyślnych haseł kont pracowników, indywidualne konta zamiast wspólnych, HTTPS na domenie, kopie zapasowe bazy.
- [ ] Publikacja zatwierdzonych dokumentów w Serwisie (strony `/regulamin` i `/polityka-prywatnosci` są gotowe i pobierają treść z plików wymienionych na początku notatki).
