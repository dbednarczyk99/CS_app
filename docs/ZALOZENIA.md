# Chleba Smak: założenia projektu

Stan na: 2026-10-13. Dokument roboczy. Punkty oznaczone **[DO USTALENIA]** wymagają decyzji właściciela.

## 1. Cel

Strona internetowa dla małej sieci piekarni ze sklepem internetowym oraz panelem administracyjnym do zarządzania treścią, asortymentem i zamówieniami. Później powstanie aplikacja mobilna, która będzie korzystać z tego samego API i tych samych kont klientów. Aplikacja nie należy do obecnego zakresu.

## 2. Architektura

```
            ┌──────────────────────┐
            │  API (NestJS+Prisma) │◄──── przyszła aplikacja mobilna
            │  MySQL               │
            └──────────┬───────────┘
          ┌────────────┴────────────┐
┌─────────▼──────────┐   ┌──────────▼─────────┐
│ Strona + sklep     │   │ Panel admina       │
│ (Next.js, nowa)    │   │ (react-admin, jest)│
└────────────────────┘   └────────────────────┘
```

- **Jedno API** obsługuje wszystkich klientów: stronę, panel i aplikację.
- **Strona publiczna** powstanie w Next.js, ze względu na SEO (wyszukiwania typu „piekarnia [miasto]”) i szybkie ładowanie. Będzie to nowy katalog `app/web/`.
- **Panel admina** zostaje na react-admin i zostanie rozbudowany o obsługę zamówień i sprzedaży.

## 3. Konta i role

| Typ konta | Role | Uprawnienia |
|---|---|---|
| Pracownik | `ADMIN` | Wszystko, w tym zarządzanie kontami pracowników |
| | `EDITOR` | Treści strony, produkty, blog |
| | `STAFF` (nowa) | Zamówienia i stany produktów tylko w przypisanym sklepie lub sklepach |
| Klient | (osobny model `Customer`) | Sklep: zamówienia, historia, dane konta |

- Konta klientów są **oddzielone** od kont pracowników (osobna tabela i osobne tokeny).
- Klient rejestruje się e-mailem i hasłem. Potrzebne są: weryfikacja e-maila, reset hasła i usunięcie konta (RODO).
- Logowanie przez Google lub Apple można dodać później, przy okazji aplikacji.
- **[DO USTALENIA]** Czy można zamawiać bez konta (jako gość)? Propozycja: gość może zamówić tylko z płatnością online. Płatność przy odbiorze wymaga konta, co ogranicza nieodebrane zamówienia.

## 4. Sklep

### 4.1 Odbiór

- Klient wybiera **punkt odbioru** (sklep) oraz **dzień i godzinę odbioru**.
- Zamówienie trzeba złożyć z wyprzedzeniem: **minimalny czas** przed odbiorem jest ustawiany w panelu, osobno dla każdego sklepu. **[DO USTALENIA]** Ile godzin?
- Godziny odbioru wynikają z godzin otwarcia sklepu (`Location.openingHours`).
- **[DO USTALENIA]** Czy liczba zamówień na jeden przedział godzinowy ma być ograniczona?

### 4.2 Bus z pieczywem

- Bus to opcjonalny punkt odbioru: przystanek w konkretnym dniu i godzinach (`BreadVanLocation`).
- Funkcję można włączać i wyłączać w panelu jednym przełącznikiem, bez zmian w kodzie.
- **[DO USTALENIA]** Czy bus ma osobną pulę produktów i ilości?

### 4.3 Asortyment i stany

- **Asortyment per sklep:** produkt jest przypisany do sklepów, w których jest sprzedawany.
- **Ilości per sklep i dzień:** pracownik ustala, ile sztuk danego produktu jest dostępnych do zamówienia online w danym sklepie na dany dzień. Zamówienie rezerwuje sztuki, a anulowanie je zwalnia.
- Żeby nie wpisywać ilości codziennie, stany są tworzone z **szablonu tygodniowego** (np. „poniedziałek: 20 chlebów żytnich”), który można nadpisać dla konkretnego dnia.
- **[DO USTALENIA]** Czy ceny są takie same we wszystkich sklepach? Propozycja: jedna cena, z możliwością dodania wyjątków później.

### 4.4 Produkt: wymagane informacje

Sprzedając żywność online, trzeba podać przed zakupem informacje wymagane przez rozporządzenie UE 1169/2011. Dlatego do produktu dochodzą:

- skład,
- **alergeny** (lista 14 alergenów),
- gramatura.

Dodatkowo:

- **stawka VAT** (potrzebna do paragonów, raportów i przyszłych faktur),
- zmiana typu ceny z `Float` na `Decimal`, bo liczby zmiennoprzecinkowe dają błędy zaokrągleń w kwotach.

### 4.5 Płatności

- **Online: Stripe** (BLIK, Przelewy24, karty, Apple Pay i Google Pay).
  - Ma dobre środowisko testowe i webhooki.
  - Alternatywą jest bezpośrednia integracja z Przelewy24 lub PayU (zwykle niższe prowizje). Można ją podmienić później, bo płatności będą zamknięte w jednym module.
- **Przy odbiorze:** gotówka lub karta w sklepie. Pracownik oznacza zamówienie jako opłacone w panelu.
- Ceny są zapisywane w zamówieniu w chwili zakupu (cena, VAT, nazwa produktu), żeby późniejsze zmiany cennika nie zmieniały historii.

### 4.6 Statusy zamówienia

```
NOWE → PRZYJĘTE → GOTOWE DO ODBIORU → ODEBRANE
   ↘ ANULOWANE            ↘ NIEODEBRANE
```

Status płatności jest śledzony osobno: `OCZEKUJE` / `OPŁACONE` / `ZWRÓCONE`.

### 4.7 Powiadomienia e-mail

- potwierdzenie złożenia zamówienia,
- „gotowe do odbioru”,
- anulowanie,
- weryfikacja konta i reset hasła.

Wysyłka przez zewnętrzną usługę, np. Resend lub SMTP.

### 4.8 Faktury: na później

Faktur nie ma w obecnym zakresie, ale projekt jest na nie przygotowany:

- dane do faktury (NIP, nazwa firmy, adres) jako opcjonalne pola zamówienia,
- zapamiętane stawki VAT w pozycjach zamówienia,
- wystawianie najlepiej przez zewnętrzny system (np. Fakturownia lub inFakt) przez ich API.

## 5. Panel sprzedaży

1. **Lista zamówień:** filtry po sklepie, dacie odbioru, statusie i sposobie płatności. Szybka zmiana statusu i oznaczanie płatności.
2. **Szczegóły zamówienia:** pozycje, dane klienta, historia zmian statusu.
3. **Odbiory na dziś:** widok dla sklepu z zamówieniami do wydania, posortowanymi po godzinie.
4. **Lista produkcji:** ile sztuk każdego produktu przygotować na dany dzień, z podziałem na sklepy (suma z zamówień).
5. **Stany:** edycja ilości per sklep i dzień oraz szablon tygodniowy.
6. **Raporty:**
   - przychód per dzień, tydzień lub miesiąc i per sklep,
   - najlepiej sprzedające się produkty,
   - podział płatności online i na miejscu,
   - liczba anulowanych i nieodebranych zamówień.
7. **Klienci:** lista kont, historia zamówień klienta, blokada konta (np. po wielokrotnym nieodebraniu zamówienia).

## 6. Strona publiczna

- strona główna,
- oferta / sklep: kategorie, produkty, koszyk, zamówienie,
- nasze sklepy (mapa, godziny otwarcia),
- bus z pieczywem (harmonogram),
- blog,
- kontakt,
- konto klienta.

Wymagane dokumenty: regulamin sklepu, polityka prywatności, informacja o cookies. **[DO USTALENIA]** Treść dostarcza właściciel lub prawnik.

## 7. Etapy

| Etap | Zakres |
|---|---|
| 0. Porządki | Commit zaległych zmian, poprawka seeda, zabezpieczenie API (guardy JWT i role), globalna walidacja DTO |
| 1. Strona publiczna | Next.js, widoki oparte na istniejących danych: produkty, blog, sklepy, bus, kontakt |
| 2. Konta klientów | Rejestracja, logowanie, weryfikacja e-mail, reset hasła, profil |
| 3. Asortyment i stany | Produkty per sklep, ilości per dzień, szablony, alergeny, VAT, `Decimal` |
| 4. Zamówienia | Koszyk, wybór punktu i terminu odbioru, rezerwacja stanów, płatność przy odbiorze, e-maile |
| 5. Płatności online | Stripe i webhooki |
| 6. Panel sprzedaży | Lista zamówień, odbiory na dziś, lista produkcji, raporty, rola `STAFF` |
| 7. Wdrożenie | Hosting, domena, kopie zapasowe bazy, dokumenty prawne |

## 8. Pytania do właściciela

1. Minimalny czas między złożeniem zamówienia a odbiorem (stały czy zależny od sklepu)?
2. Czy można zamawiać bez konta?
3. Czy liczba odbiorów w jednym przedziale godzinowym ma być ograniczona?
4. Czy ceny są takie same we wszystkich sklepach?
5. Czy bus przyjmuje zamówienia i z jakiej puli produktów?
6. Czy klient może anulować zamówienie sam, i do kiedy?
7. Co robimy z nieodebranymi zamówieniami opłaconymi online (zwrot czy brak zwrotu)?
8. Kto w sklepach będzie obsługiwał zamówienia: czy każdy sklep potrzebuje własnego konta w panelu?
