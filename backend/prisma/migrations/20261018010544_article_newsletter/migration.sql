-- AlterTable
ALTER TABLE `Article` ADD COLUMN `newsletterRecipients` INTEGER NULL,
    ADD COLUMN `newsletterSentAt` DATETIME(3) NULL,
    ADD COLUMN `sendAsNewsletter` BOOLEAN NOT NULL DEFAULT true;


-- istniejące artykuły nie są wysyłane (inaczej poprawka starego wpisu wysłałaby go do wszystkich)
UPDATE `Article` SET `sendAsNewsletter` = false;
