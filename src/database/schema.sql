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

ALTER TABLE `cards` ADD COLUMN `balance` FLOAT NOT NULL DEFAULT 0;

CREATE TABLE transactions (
    `id` INT AUTO_INCREMENT,
    `card_id` INT NOT NULL,
    `amount` FLOAT NOT NULL,
    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`card_id`) REFERENCES `cards`(`id`)
)

DELIMITER $$

CREATE TRIGGER update_card_balance_trigger
AFTER UPDATE ON `cards` FOR EACH ROW
BEGIN
  IF NEW.balance != OLD.balance THEN
    INSERT INTO transactions (card_id, amount) VALUES (NEW.id, NEW.balance - OLD.balance);
  END IF;
END$$

DELIMITER ;

