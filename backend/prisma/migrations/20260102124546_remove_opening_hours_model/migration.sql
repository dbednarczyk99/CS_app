/*
  Warnings:

  - You are about to drop the `OpeningHours` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `OpeningHours` DROP FOREIGN KEY `OpeningHours_locationId_fkey`;

-- AlterTable
ALTER TABLE `Location` ADD COLUMN `openingHours` JSON NULL;

-- DropTable
DROP TABLE `OpeningHours`;
