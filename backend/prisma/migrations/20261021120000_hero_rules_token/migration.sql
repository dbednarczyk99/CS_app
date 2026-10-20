-- Slajd „Rezerwacja”: godzina z zasad rezerwacji (znacznik {godzina}) zamiast wpisanej 18:00 – tylko gdy tekst nie był zmieniany
UPDATE `HeroSlide`
SET `text` = 'Zarezerwuj wypieki do {godzina} dnia poprzedniego i odbierz je w piekarni albo w chlebowozie. Płacisz przy odbiorze, bez zakładania konta.'
WHERE `defaultKey` = 'rezerwacja'
  AND `text` = 'Zarezerwuj wypieki do 18:00 dnia poprzedniego i odbierz je w piekarni albo w chlebowozie. Płacisz przy odbiorze, bez zakładania konta.';
