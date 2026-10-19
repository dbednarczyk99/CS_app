-- Etykieta „Promocja” na liście etykiet: stała (system = 'promo'), nadawana przez stronę przy trwającej promocji.
-- Można zmienić jej nazwę, kolor i kolejność; adres filtra jak dotąd: ?etykiety=promocje

-- AlterTable
ALTER TABLE `ProductLabel` ADD COLUMN `system` VARCHAR(20) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ProductLabel_system_key` ON `ProductLabel`(`system`);

INSERT INTO `ProductLabel` (`id`, `name`, `slug`, `color`, `order`, `system`, `updatedAt`)
    VALUES (UUID(), 'Promocja', 'promocje', 'red', 0, 'promo', CURRENT_TIMESTAMP(3));
