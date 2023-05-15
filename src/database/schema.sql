CREATE TABLE IF NOT EXISTS `stations` (
    `id` INT AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL UNIQUE,
    `line` VARCHAR(32) NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE INDEX `station_name_index` ON `stations` (`name`);

ALTER TABLE `stations` ADD COLUMN `is_deleted` TINYINT NOT NULL DEFAULT 0;

CREATE VIEW `current_stations` AS
    SELECT * FROM `stations` WHERE `is_deleted` = 0;

CREATE TABLE IF NOT EXISTS `cards` (
    `id` INT AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL UNIQUE,
    PRIMARY KEY(`id`)
);

