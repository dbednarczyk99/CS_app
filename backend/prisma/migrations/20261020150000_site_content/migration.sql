-- „Domowy WordPress”, etap 1: treści sekcji strony (SiteContent) i slajdy karuzeli (HeroSlide).
-- Slajdy startowe = dotychczasowa karuzela (strona po wdrożeniu wygląda tak samo).

-- CreateTable
CREATE TABLE `SiteContent` (
    `key` VARCHAR(60) NOT NULL,
    `data` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HeroSlide` (
    `id` VARCHAR(191) NOT NULL,
    `kind` ENUM('CUSTOM', 'VAN', 'BAKERIES', 'SEASONAL') NOT NULL DEFAULT 'CUSTOM',
    `name` VARCHAR(20) NOT NULL,
    `eyebrow` VARCHAR(50) NOT NULL,
    `titleLine1` VARCHAR(30) NOT NULL,
    `titleLine2` VARCHAR(30) NOT NULL DEFAULT '',
    `text` VARCHAR(220) NOT NULL,
    `cta1Label` VARCHAR(30) NULL,
    `cta1Href` VARCHAR(300) NULL,
    `cta2Label` VARCHAR(30) NULL,
    `cta2Href` VARCHAR(300) NULL,
    `imageUrl` VARCHAR(500) NULL,
    `imageAlt` VARCHAR(160) NOT NULL DEFAULT '',
    `imagePosition` VARCHAR(30) NOT NULL DEFAULT 'center',
    `mobileImageUrl` VARCHAR(500) NULL,
    `mobileImagePosition` VARCHAR(30) NOT NULL DEFAULT 'center',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startsAt` DATETIME(3) NULL,
    `endsAt` DATETIME(3) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


INSERT INTO `HeroSlide` (`id`, `kind`, `name`, `eyebrow`, `titleLine1`, `titleLine2`, `text`, `cta1Label`, `cta1Href`, `cta2Label`, `cta2Href`, `imageUrl`, `imageAlt`, `imagePosition`, `mobileImageUrl`, `mobileImagePosition`, `isActive`, `order`, `updatedAt`) VALUES
  (UUID(), 'CUSTOM', 'Piekarnia', 'Piekarnia rzemieślnicza · Kraków', 'Chleb,', 'który ma czas',
   'Naturalny zakwas, długa fermentacja i ręczna praca. Codziennie od świtu w naszych krakowskich piekarniach.',
   'Zobacz ofertę', '/oferta', 'Znajdź piekarnię', '/piekarnie',
   '/images/hero-desktop.jpg', 'Przekrojony chleb na zakwasie w lnianej ściereczce', 'center', '/images/hero-mobile.jpg', '70% center', true, 1, CURRENT_TIMESTAMP(3)),
  (UUID(), 'CUSTOM', 'Rezerwacja', 'Rezerwacja online', 'Twój chleb', 'już czeka',
   'Zarezerwuj wypieki do 18:00 dnia poprzedniego i odbierz je w piekarni albo w chlebowozie. Płacisz przy odbiorze, bez zakładania konta.',
   'Wybierz wypieki', '/oferta', NULL, NULL,
   '/images/piekarz.jpg', '', '60% center', '/images/chleb-deska.jpg', 'center 70%', true, 2, CURRENT_TIMESTAMP(3)),
  (UUID(), 'VAN', 'Chlebowóz', 'Chlebowóz', 'Piekarnia', 'na kółkach',
   'Stałe dni i stałe miejsca w całym Krakowie – pieczywo prosto z pieca, bliżej Ciebie.',
   'Sprawdź trasę', '/chlebowoz', NULL, NULL,
   '/images/chlebowoz.jpg', '', '65% center', '/images/chlebowoz.jpg', '60% center', true, 3, CURRENT_TIMESTAMP(3)),
  (UUID(), 'BAKERIES', 'Piekarnie', 'Nasze piekarnie', '{piekarnie}', 'w Krakowie',
   'Świeże pieczywo od rana, kawa, kanapki przygotowywane na miejscu i chwila przy stoliku.',
   'Znajdź najbliższą', '/piekarnie', NULL, NULL,
   '/images/lokal.jpg', '', '70% center', '/images/wnetrze.jpg', 'center', true, 4, CURRENT_TIMESTAMP(3)),
  (UUID(), 'SEASONAL', 'Sezonowo', 'Sezonowo', 'Tylko', 'przez chwilę',
   'Wypieki, które pojawiają się w naszych piekarniach tylko w swoim sezonie. Sprawdź, co pieczemy teraz – póki sezon trwa.',
   'Zobacz sezonowe', '/oferta?etykiety=sezonowe', NULL, NULL,
   NULL, '', 'center', NULL, 'center', true, 5, CURRENT_TIMESTAMP(3));
