# Chleba Smak: założenia projektu

Stan na: 2026-10-15. Dokument roboczy. Punkty oznaczone **[DO USTALENIA]** wymagają decyzji właściciela.

## 1. Cel

Strona internetowa małej sieci piekarni premium z **systemem rezerwacji pieczywa** oraz panel administracyjny do zarządzania treścią, asortymentem i rezerwacjami. W przyszłości aplikacja mobilna korzystająca z tego samego API (poza obecnym zakresem).

**Zmiana względem pierwotnej koncepcji:** zamiast sklepu z płatnościami online jest **rezerwacja z płatnością wyłącznie na miejscu**, bez kont klientów.

## 2. Architektura

```
            ┌──────────────────────┐
            │  API (NestJS+Prisma) │◄──── przyszła aplikacja mobilna
            │  MySQL, SMTP (e-mail)│
            └──────────┬───────────┘
          ┌────────────┴────────────┐
┌─────────▼──────────┐   ┌──────────▼─────────┐
│ Strona + rezerwacje│   │ Panel admina       │
│ (Next.js, web/)    │   │ (react-admin)      │
└────────────────────┘   └────────────────────┘
```

## 3. Konta i role

- **Klienci nie mają kont.** Przy rezerwacji podają imię, telefon i e-mail.
- **Pracownicy** logują się do panelu: `ADMIN` (wszystko), `EDITOR` (treści i rezerwacje), `BLOGGER` (blog), `VIEWER` (podgląd).
- **[DO USTALENIA]** Rola dla obsługi punktu, widząca tylko rezerwacje swojego sklepu.

## 4. Rezerwacje

### 4.1 Odbiór
- W **piekarni** (wybór dnia i godziny co 30 min w godzinach otwarcia; bez wpisanych godzin przyjmujemy 7:00–18:00) albo z **chlebowozu** (przystanek w dniu jego postoju, w oknie postoju).

### 4.2 Terminy (czas polski)
- Rezerwacja na dany dzień **najpóźniej do 18:00 dnia poprzedzającego**.
- Najdalej **5 dni do przodu**.
- Anulowanie przez klienta linkiem z e-maila, **do 18:00 dnia poprzedzającego** odbiór.

### 4.3 Asortyment
- Rezerwować można produkty z włączonym przełącznikiem **„Można rezerwować online”** (domyślnie wszystkie). Lody i napoje: tylko na miejscu.
- **Bez limitów ilości** na start. **[NA PRZYSZŁOŚĆ]** Limity sztuk produktu na punkt i dzień. Model danych to przewiduje: pozycje rezerwacji są osobnymi rekordami.

### 4.4 Potwierdzenie i płatność
- Rezerwacja jest **od razu przyjęta**, bez zatwierdzania przez piekarnię.
- Klient dostaje **e-mail z potwierdzeniem**: numer rezerwacji, termin i miejsce, produkty, kwota, link do anulowania.
- **Płatność wyłącznie przy odbiorze.** Ceny są zapamiętywane w rezerwacji w chwili jej złożenia.

### 4.5 Numer rezerwacji
`KOD-RRMMDD-NN`, np. **WIL-261017-03**: kod punktu (ustawiany przy piekarni w panelu; chlebowóz = `BUS`), data odbioru (rok, miesiąc, dzień) i kolejny numer w tym punkcie na ten dzień. Unikalny także między latami.

### 4.6 Statusy
Tylko dwa, wyłącznie informacyjne: **Rezerwacja przyjęta** i **Rezerwacja anulowana** (anuluje klient linkiem z e-maila). Obsługa nie zmienia statusów w panelu – rezerwacje są tylko do podglądu.

### 4.7 Ochrona przed nadużyciami
- Ukryte pole-pułapka na boty.
- Maksymalnie **3 aktywne rezerwacje na numer telefonu**.
- **[DO ROZWAŻENIA]** Cloudflare Turnstile (darmowa ochrona antyspamowa) oraz blokada numerów osób notorycznie nieodbierających rezerwacji.

### 4.8 Powiadomienia dla piekarni
- Panel: lista rezerwacji i zestawienie **„Do przygotowania”** (sumy produktów i lista rezerwacji na dzień, z podziałem na punkty, do wydruku).
- **Zbiorczy e-mail** z zestawieniem: gotowy (przycisk „Wyślij e-mailem” w panelu). **[DO USTALENIA]** Automatyczna wysyłka codziennie **o 18:30** (`DAILY_SUMMARY_ENABLED=true`) z zestawieniem na kolejny dzień (o tej porze lista na jutro jest już ostateczna). Opcje dodatkowe: powiadomienia push z panelu (darmowe), SMS (płatne, ok. 0,10–0,17 zł za wiadomość).

### 4.9 Przechowywanie danych (RODO)
- Dane klientów w rezerwacjach złożonych ponad **6 miesięcy** temu (`RESERVATION_RETENTION_MONTHS`) są codziennie o 3:00 **anonimizowane** (produkty, daty i punkty zostają do statystyk). Na żądanie klienta – przycisk „Usuń dane klienta” w panelu.
- Okres trzeba wpisać do polityki prywatności.

### 4.10 E-mail
- Lokalnie: Mailpit (podgląd na http://localhost:8025).
- Produkcja: dostawca SMTP, np. **Resend** (darmowy do 3000 maili miesięcznie), wysyłka z domeny `@chlebasmak.pl`.

## 5. Strona publiczna

Strona główna, Oferta (z przyciskami „Zarezerwuj”), strona produktu, Rezerwacja, Piekarnie (mapa Google), Chlebowóz (mapa i harmonogram), O nas, Aktualności, Kontakt.

Wymagane przed startem: **polityka prywatności** (dane z rezerwacji, mapy Google) i **regulamin rezerwacji**. **[DO USTALENIA]** Treść od właściciela lub prawnika.

## 6. Etapy

| Etap | Zakres | Stan |
|---|---|---|
| 0. Porządki | Zabezpieczenie API, walidacja, seed | ✅ |
| 1. Strona publiczna | Nowy wygląd, podstrony, mapa Google | ✅ |
| 2. Rezerwacje | Strona, API, e-mail do klienta, panel | ✅ (wersja pierwsza) |
| 3. Powiadomienia dla piekarni | E-mail zbiorczy 18:30 / push / SMS | [DO USTALENIA] |
| 4. Treści i dane | Prawdziwe ceny, opisy, godziny otwarcia, trasa busa, teksty „O nas” | właściciel |
| 5. Wdrożenie | Hosting (stale działający backend), domena, SMTP, kopie zapasowe, dokumenty prawne | — |

## 7. Pytania do właściciela

1. Zbiorczy e-mail o 18:30: jeden do całej piekarni czy osobny do każdego punktu? Jaki adres?
2. Czy wysyłać e-mail także wtedy, gdy na jutro nie ma rezerwacji?
3. Prawdziwe godziny otwarcia sklepów i trasa chlebowozu (wiele przystanków dziennie?).
4. Ceny i opisy produktów, lista produktów do rezerwacji.
5. Kto obsługuje rezerwacje w punktach: czy potrzebne są osobne konta w panelu?
