-- Dotychczasowe statusy robocze → „przyjęta” (zostają tylko: przyjęta, anulowana)
UPDATE `Reservation` SET `status` = 'NEW' WHERE `status` IN ('READY', 'PICKED_UP', 'NO_SHOW');

-- Numery KOD-MMDD-NN → KOD-RRMMDD-NN (rok z daty odbioru), żeby były unikalne także między latami
UPDATE `Reservation`
SET `number` = CONCAT(
  SUBSTRING_INDEX(`number`, '-', 1), '-',
  SUBSTRING(`pickupDate`, 3, 2), SUBSTRING_INDEX(SUBSTRING_INDEX(`number`, '-', 2), '-', -1), '-',
  SUBSTRING_INDEX(`number`, '-', -1)
)
WHERE `number` REGEXP '^[A-Z]+-[0-9]{4}-[0-9]+$';

-- DropIndex
DROP INDEX `Reservation_number_idx` ON `Reservation`;

-- DropIndex
DROP INDEX `Reservation_pickupDate_number_key` ON `Reservation`;

-- AlterTable
ALTER TABLE `Reservation` MODIFY `status` ENUM('NEW', 'CANCELLED') NOT NULL DEFAULT 'NEW';

-- CreateIndex
CREATE UNIQUE INDEX `Reservation_number_key` ON `Reservation`(`number`);

