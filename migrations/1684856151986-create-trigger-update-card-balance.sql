CREATE TRIGGER update_card_balance_trigger
AFTER UPDATE ON `cards` FOR EACH ROW
IF NEW.balance != OLD.balance THEN
INSERT INTO transactions (card_id, amount) VALUES (NEW.id, NEW.balance - OLD.balance);
END IF;
