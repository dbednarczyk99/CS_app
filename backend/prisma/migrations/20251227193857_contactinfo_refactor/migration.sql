/*
  Warnings:

  - You are about to drop the column `email` on the `ContactInfo` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `ContactInfo` table. All the data in the column will be lost.
  - You are about to drop the column `contactId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `contactId` on the `Media` table. All the data in the column will be lost.
  - Added the required column `type` to the `ContactInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `ContactInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Location` DROP FOREIGN KEY `Location_contactId_fkey`;

-- DropForeignKey
ALTER TABLE `Media` DROP FOREIGN KEY `Media_contactId_fkey`;

-- DropIndex
DROP INDEX `Location_contactId_fkey` ON `Location`;

-- DropIndex
DROP INDEX `Media_contactId_fkey` ON `Media`;

-- AlterTable
ALTER TABLE `ContactInfo` DROP COLUMN `email`,
    DROP COLUMN `phone`,
    ADD COLUMN `label` VARCHAR(191) NULL,
    ADD COLUMN `type` ENUM('PHONE', 'EMAIL', 'OTHER') NOT NULL,
    ADD COLUMN `value` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Location` DROP COLUMN `contactId`;

-- AlterTable
ALTER TABLE `Media` DROP COLUMN `contactId`,
    ADD COLUMN `icon` VARCHAR(191) NOT NULL;
