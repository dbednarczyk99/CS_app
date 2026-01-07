/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Media_name_key` ON `Media`(`name`);
