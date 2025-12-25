/*
  Warnings:

  - Made the column `isActive` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `isSeasonal` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `isActive` BOOLEAN NOT NULL DEFAULT true;
