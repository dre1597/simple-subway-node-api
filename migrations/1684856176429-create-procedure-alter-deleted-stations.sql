CREATE PROCEDURE alter_deleted_stations (IN deleted TINYINT)
    UPDATE `stations` SET `is_deleted` = deleted;
