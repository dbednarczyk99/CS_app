-- Pakiet „Marketing”: planowanie publikacji, skuteczność newslettera, baner promocji, etykiety z datami,
-- historia promocji (skuteczność), ocena Google piekarni

-- AlterTable
ALTER TABLE `Announcement` ADD COLUMN `system` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `Article` ADD COLUMN `publishAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `DailyStat` MODIFY `key` VARCHAR(100) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Location` ADD COLUMN `googlePlaceId` VARCHAR(300) NULL,
    ADD COLUMN `googleRating` DOUBLE NULL,
    ADD COLUMN `googleRatingAt` DATETIME(3) NULL,
    ADD COLUMN `googleRatingCount` INTEGER NULL;

-- AlterTable
ALTER TABLE `ProductLabel` ADD COLUMN `activeFrom` CHAR(10) NULL,
    ADD COLUMN `activeTo` CHAR(10) NULL;

-- CreateTable
CREATE TABLE `PromoPeriod` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `promoPrice` DOUBLE NULL,
    `from` CHAR(10) NOT NULL,
    `to` CHAR(10) NULL,
    `endedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PromoPeriod_productId_endedAt_idx`(`productId`, `endedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Announcement_system_key` ON `Announcement`(`system`);


-- Stały komunikat na banerze: pokazywany automatycznie, gdy trwa jakakolwiek promocja (treść do zmiany w panelu)
INSERT INTO `Announcement` (`id`, `message`, `linkUrl`, `linkLabel`, `isActive`, `order`, `system`, `updatedAt`)
    VALUES (UUID(), 'Trwają promocje – sprawdź, co teraz kupisz taniej.', '/oferta?etykiety=promocje', 'Zobacz promocje', true, 0, 'promo', CURRENT_TIMESTAMP(3));

-- Historia: trwające promocje (początek – data z panelu albo dzień ostatniej zmiany produktu)
INSERT INTO `PromoPeriod` (`id`, `productId`, `productName`, `price`, `promoPrice`, `from`, `to`, `updatedAt`)
    SELECT UUID(), `id`, `name`, `price`, `promoPrice`, COALESCE(`promoFrom`, DATE_FORMAT(`updatedAt`, '%Y-%m-%d')), `promoTo`, CURRENT_TIMESTAMP(3)
    FROM `Product` WHERE `isPromo` = true;
