/*
  Warnings:

  - You are about to alter the column `name` on the `Media` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Media` MODIFY `name` ENUM('FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'LINKEDIN', 'TWITTER', 'PINTEREST', 'YOUTUBE') NOT NULL;
