-- AlterTable
ALTER TABLE `BreadVanLocation` ADD COLUMN `lat` DOUBLE NULL,
    ADD COLUMN `lng` DOUBLE NULL;

-- AlterTable
ALTER TABLE `Location` ADD COLUMN `lat` DOUBLE NULL,
    ADD COLUMN `lng` DOUBLE NULL;
