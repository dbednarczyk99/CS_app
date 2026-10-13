/*
  Warnings:

  - You are about to drop the `_BlogItemToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `articleId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_BlogItemToTag` DROP FOREIGN KEY `_BlogItemToTag_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BlogItemToTag` DROP FOREIGN KEY `_BlogItemToTag_B_fkey`;

-- AlterTable
ALTER TABLE `Tag` ADD COLUMN `articleId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_BlogItemToTag`;

-- AddForeignKey
ALTER TABLE `Tag` ADD CONSTRAINT `Tag_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `BlogItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
