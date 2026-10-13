-- AlterTable
ALTER TABLE `Article` MODIFY `shortDescription` VARCHAR(500) NOT NULL,
    MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `description` TEXT NOT NULL;
