# Bezpieczeństwo – co jest w kodzie i co zrobić przy wdrożeniu

## W kodzie (gałąź `bezpieczenstwo`, 21.10.2026)

- **Logowanie**:
  - blokada 15 min po 10 błędach z jednego adresu;
  - rosnąca przerwa po 5 błędach na jedno konto (30 s → maks. 15 min);
  - ta sama odpowiedź dla istniejących i nieistniejących kont.
- **Sesje**: token 8 h; zmiana hasła, roli albo usunięcie konta działa od razu.
- **Odzyskiwanie hasła**:
  - „Nie pamiętam hasła” w panelu wysyła jednorazowy link (30 min) na e-mail konta, ustawiany w Konta;
  - po zmianie przychodzi powiadomienie;
  - e-maile o koncie wychodzą także przy wyłączonych e-mailach w „Usługi i koszty”.
  - Awaryjnie, na serwerze: `npm run haslo -- <login>`.
- **Wgrywanie plików**:
  - tylko JPG, PNG i WebP do 10 MB;
  - typ sprawdzany po zawartości pliku, nazwa pliku losowa;
  - `/uploads` wysyła nagłówki `nosniff` i `CSP sandbox`.
- **Formularze**:
  - pułapka na boty i limity: kontakt, newsletter, rezerwacje (5 z adresu na godzinę, 60 na 15 min), reset hasła;
  - adres klienta przychodzi od serwera strony z sekretem `INTERNAL_API_SECRET`;
  - bez sekretu API liczy adres połączenia, więc nie da się go podrobić.
- **Nagłówki**:
  - API: `helmet` (CSP `default-src 'none'`, HSTS…);
  - strona: `frame-ancestors`, `nosniff`, HSTS, `Permissions-Policy`.
- **Logi**: bez hasła do bazy i bez tokenów z linków.
- **Start serwera**: w trybie produkcyjnym API nie wystartuje bez `JWT_SECRET` (min. 32 znaki).

## Lista kontrolna wdrożenia

1. **Sekrety**, każdy osobno: `openssl rand -hex 32`.
   - API: `JWT_SECRET`, `INTERNAL_API_SECRET`, `REVALIDATE_SECRET`, `NODE_ENV=production`.
   - Strona: `INTERNAL_API_SECRET` i `REVALIDATE_SECRET` – takie same jak w API.
2. **Konta**:
   - zmienić hasła kont testowych (`admin`, `editor`) albo je usunąć;
   - założyć konta z silnymi hasłami;
   - administratorowi wpisać e-mail do odzyskiwania hasła (Gmail piekarni).
3. **HTTPS** wszędzie: strona, panel, API.
4. **nginx przed API i stroną**:
   - `proxy_set_header X-Real-IP $remote_addr;`;
   - w API `TRUST_PROXY=1`.
5. **Nagłówki panelu**: panel to pliki statyczne, więc ustawia je serwer, który je wysyła.

   ```
   add_header X-Frame-Options DENY;
   add_header Content-Security-Policy "frame-ancestors 'none'; object-src 'none'; base-uri 'self'";
   add_header X-Content-Type-Options nosniff;
   add_header Referrer-Policy strict-origin-when-cross-origin;
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
   ```

6. **Nie wystawiać do internetu**: MySQL (3307), Adminer (8080), Mailpit. Zapora (firewall) przepuszcza tylko 80/443 (+ SSH tylko z kluczem).
7. **API dostępne tylko przez nginx**, nie bezpośrednio na porcie 3000.
8. **`CORS_ORIGINS`**: tylko prawdziwe adresy strony i panelu.
9. **Klucze Google**: Maps JS ograniczony do domeny strony (HTTP referrer), Places tylko do adresu IP serwera.
10. **Kopie zapasowe**: codziennie baza i katalog `uploads`, z przechowywaniem poza serwerem; raz sprawdzić przywracanie.
11. **Opcjonalnie**: Cloudflare przed domeną (ochrona przed zalewem ruchem). Jeśli tak, adres klienta brać z `CF-Connecting-IP`.
12. **Aktualizacje**: co miesiąc `npm audit --omit=dev` w `backend`, `web`, `frontend`.

## Znane, odłożone

- Prisma 6 → 7 i Next 16: luki są tylko w narzędziach używanych przy budowaniu i migracjach (`prisma` CLI, PostCSS), nie w kodzie, który obsługuje ruch z internetu. Aktualizacja to większa zmiana.
- Logowanie dwuetapowe (2FA) – odłożone na życzenie właściciela.
