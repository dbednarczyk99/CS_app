-- CreateTable
CREATE TABLE `DailyStat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` CHAR(10) NOT NULL,
    `metric` VARCHAR(20) NOT NULL,
    `key` VARCHAR(60) NOT NULL DEFAULT '',
    `count` INTEGER NOT NULL DEFAULT 0,

    INDEX `DailyStat_metric_date_idx`(`metric`, `date`),
    UNIQUE INDEX `DailyStat_date_metric_key_key`(`date`, `metric`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

