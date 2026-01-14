/*
  Warnings:

  - You are about to drop the column `isMain` on the `BreadVanImages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[articleId,order]` on the table `ArticleImages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[descriptionId,order]` on the table `BreadVanImages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dayOfTheWeek]` on the table `BreadVanLocation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,order]` on the table `ProductImages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `ArticleImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `BreadVanImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `ProductImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ArticleImages` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `BreadVanImages` DROP COLUMN `isMain`,
    ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ProductImages` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `order` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ArticleImages_articleId_order_key` ON `ArticleImages`(`articleId`, `order`);

-- CreateIndex
CREATE UNIQUE INDEX `BreadVanImages_descriptionId_order_key` ON `BreadVanImages`(`descriptionId`, `order`);

-- CreateIndex
CREATE UNIQUE INDEX `BreadVanLocation_dayOfTheWeek_key` ON `BreadVanLocation`(`dayOfTheWeek`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductImages_productId_order_key` ON `ProductImages`(`productId`, `order`);
