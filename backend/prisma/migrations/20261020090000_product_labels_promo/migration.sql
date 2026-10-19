-- Etykiety produktów jako osobna lista (dodawana w panelu) + promocje z datami.
-- Dotychczasowe etykiety „Nowość” i „Bestseller” przechodzą do nowej listy razem z przypisaniami.

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `isPromo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `promoFrom` CHAR(10) NULL,
    ADD COLUMN `promoPrice` DOUBLE NULL,
    ADD COLUMN `promoTo` CHAR(10) NULL;

-- CreateTable
CREATE TABLE `ProductLabel` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `slug` VARCHAR(40) NOT NULL,
    `color` VARCHAR(10) NOT NULL DEFAULT 'gold',
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProductLabel_name_key`(`name`),
    UNIQUE INDEX `ProductLabel_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductToProductLabel` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProductToProductLabel_AB_unique`(`A`, `B`),
    INDEX `_ProductToProductLabel_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ProductToProductLabel` ADD CONSTRAINT `_ProductToProductLabel_A_fkey` FOREIGN KEY (`A`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToProductLabel` ADD CONSTRAINT `_ProductToProductLabel_B_fkey` FOREIGN KEY (`B`) REFERENCES `ProductLabel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Dotychczasowe etykiety (adresy filtrów jak dotąd: ?etykiety=nowosci,bestsellery)
INSERT INTO `ProductLabel` (`id`, `name`, `slug`, `color`, `order`, `updatedAt`) VALUES
    (UUID(), 'Nowość', 'nowosci', 'gold', 1, CURRENT_TIMESTAMP(3)),
    (UUID(), 'Bestseller', 'bestsellery', 'cream', 2, CURRENT_TIMESTAMP(3));

INSERT INTO `_ProductToProductLabel` (`A`, `B`)
    SELECT p.`id`, l.`id` FROM `Product` p JOIN `ProductLabel` l ON l.`slug` = 'nowosci' WHERE p.`isNew` = true;
INSERT INTO `_ProductToProductLabel` (`A`, `B`)
    SELECT p.`id`, l.`id` FROM `Product` p JOIN `ProductLabel` l ON l.`slug` = 'bestsellery' WHERE p.`isBestseller` = true;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `isBestseller`,
    DROP COLUMN `isNew`;
