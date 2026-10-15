-- AlterTable
ALTER TABLE `Product` ADD COLUMN `isReservable` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `Reservation` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(16) NOT NULL,
    `status` ENUM('NEW', 'READY', 'PICKED_UP', 'NO_SHOW', 'CANCELLED') NOT NULL DEFAULT 'NEW',
    `pickupType` ENUM('STORE', 'VAN') NOT NULL,
    `locationId` VARCHAR(191) NULL,
    `vanStopId` VARCHAR(191) NULL,
    `pickupLabel` VARCHAR(191) NOT NULL,
    `pickupDate` VARCHAR(10) NOT NULL,
    `pickupTime` VARCHAR(20) NULL,
    `customerName` VARCHAR(100) NOT NULL,
    `customerPhone` VARCHAR(20) NOT NULL,
    `customerEmail` VARCHAR(200) NOT NULL,
    `notes` VARCHAR(500) NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `cancelToken` VARCHAR(64) NOT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Reservation_number_key`(`number`),
    UNIQUE INDEX `Reservation_cancelToken_key`(`cancelToken`),
    INDEX `Reservation_pickupDate_status_idx`(`pickupDate`, `status`),
    INDEX `Reservation_customerPhone_idx`(`customerPhone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReservationItem` (
    `id` VARCHAR(191) NOT NULL,
    `reservationId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `productName` VARCHAR(191) NOT NULL,
    `unitPrice` DECIMAL(10, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_vanStopId_fkey` FOREIGN KEY (`vanStopId`) REFERENCES `BreadVanLocation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservationItem` ADD CONSTRAINT `ReservationItem_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservationItem` ADD CONSTRAINT `ReservationItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
