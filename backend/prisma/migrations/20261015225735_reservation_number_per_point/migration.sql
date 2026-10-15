-- DropIndex
DROP INDEX `Reservation_number_key` ON `Reservation`;

-- AlterTable
ALTER TABLE `Location` ADD COLUMN `code` VARCHAR(6) NULL;

-- AlterTable
ALTER TABLE `Reservation` MODIFY `number` VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Location_code_key` ON `Location`(`code`);

-- CreateIndex
CREATE INDEX `Reservation_number_idx` ON `Reservation`(`number`);

-- CreateIndex
CREATE UNIQUE INDEX `Reservation_pickupDate_number_key` ON `Reservation`(`pickupDate`, `number`);

