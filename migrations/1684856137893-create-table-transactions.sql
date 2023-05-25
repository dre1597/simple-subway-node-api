CREATE TABLE IF NOT EXISTS transactions (
    `id` INT AUTO_INCREMENT,
    `card_id` INT NOT NULL,
    `amount` FLOAT NOT NULL,
    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`card_id`) REFERENCES `cards`(`id`)
);
