-- Odzyskiwanie hasła: adres e-mail konta i jednorazowy token resetu
ALTER TABLE `User` ADD COLUMN `email` VARCHAR(160) NULL,
    ADD COLUMN `resetTokenExpires` DATETIME(3) NULL,
    ADD COLUMN `resetTokenHash` VARCHAR(64) NULL;

CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

CREATE UNIQUE INDEX `User_resetTokenHash_key` ON `User`(`resetTokenHash`);
