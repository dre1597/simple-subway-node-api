import {
  MAX_CARD_NAME_LENGTH,
  MIN_CARD_NAME_LENGTH,
} from '../../@core/card/domain/card';
import { UpdateCardValidator } from './update-card.validator';

describe('UpdateCardValidator', () => {
  it('should validate', async () => {
    await UpdateCardValidator.validate();

    await UpdateCardValidator.validate('any_name');

    await UpdateCardValidator.validate('any_name', 0);

    await expect(async () => {
      await UpdateCardValidator.validate('    ');
    }).rejects.toThrow(
      `name must be at least ${MIN_CARD_NAME_LENGTH} characters`,
    );

    await expect(async () => {
      await UpdateCardValidator.validate('an');
    }).rejects.toThrow(
      `name must be at least ${MIN_CARD_NAME_LENGTH} characters`,
    );

    await expect(async () => {
      await UpdateCardValidator.validate('a'.repeat(MAX_CARD_NAME_LENGTH + 1));
    }).rejects.toThrow(
      `name must be at most ${MAX_CARD_NAME_LENGTH} characters`,
    );
  });
});
