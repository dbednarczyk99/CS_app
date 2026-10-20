-- Każdy slajd karuzeli musi mieć zdjęcie (bez zastępczego zdjęcia produktu sezonowego)
UPDATE `HeroSlide` SET `imageUrl` = '/images/sezonowe.jpg', `imageAlt` = 'Jagodzianki – sezonowy wypiek Chleba Smak' WHERE `imageUrl` IS NULL AND `kind` = 'SEASONAL';
UPDATE `HeroSlide` SET `imageUrl` = '/images/hero-desktop.jpg', `isActive` = false WHERE `imageUrl` IS NULL;

-- AlterTable
ALTER TABLE `HeroSlide` MODIFY `imageUrl` VARCHAR(500) NOT NULL;
