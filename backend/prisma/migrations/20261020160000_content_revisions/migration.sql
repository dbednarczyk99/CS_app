-- Historia wersji treści (Przywróć wcześniejszą wersję) i klucz slajdów startowych (Przywróć stan domyślny).

-- AlterTable
ALTER TABLE `HeroSlide` ADD COLUMN `defaultKey` VARCHAR(20) NULL;

-- CreateTable
CREATE TABLE `ContentRevision` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(80) NOT NULL,
    `data` JSON NOT NULL,
    `createdBy` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ContentRevision_key_createdAt_idx`(`key`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `HeroSlide_defaultKey_key` ON `HeroSlide`(`defaultKey`);


-- slajdy startowe z migracji 20261020150000_site_content
UPDATE `HeroSlide` SET `defaultKey` = 'chlebowoz' WHERE `kind` = 'VAN';
UPDATE `HeroSlide` SET `defaultKey` = 'piekarnie' WHERE `kind` = 'BAKERIES';
UPDATE `HeroSlide` SET `defaultKey` = 'sezonowe' WHERE `kind` = 'SEASONAL';
UPDATE `HeroSlide` SET `defaultKey` = 'marka' WHERE `kind` = 'CUSTOM' AND `imageUrl` = '/images/hero-desktop.jpg';
UPDATE `HeroSlide` SET `defaultKey` = 'rezerwacja' WHERE `kind` = 'CUSTOM' AND `imageUrl` = '/images/piekarz.jpg';
