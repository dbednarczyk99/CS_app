-- Chlebowóz: przystanki można ukrywać (zamiast usuwać) i jednego dnia może być kilka przystanków
DROP INDEX `BreadVanLocation_dayOfTheWeek_key` ON `BreadVanLocation`;

ALTER TABLE `BreadVanLocation` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX `BreadVanLocation_dayOfTheWeek_idx` ON `BreadVanLocation`(`dayOfTheWeek`);
