CREATE VIEW `current_stations` AS
    SELECT * FROM `stations` WHERE `is_deleted` = 0;
