-- Czytelne adresy produktów i wpisów (SEO). Istniejące rekordy dostają slug przy starcie serwera (ensureSlugs).

-- AlterTable
ALTER TABLE `Article` ADD COLUMN `slug` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `slug` VARCHAR(80) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Article_slug_key` ON `Article`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Product_slug_key` ON `Product`(`slug`);

