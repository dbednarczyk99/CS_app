-- Planowanie dostępności produktu: „Dostępny od” / „Niedostępny od” (wykonywane co minutę, potem czyszczone)

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `availableFrom` DATETIME(3) NULL,
    ADD COLUMN `unavailableFrom` DATETIME(3) NULL;

