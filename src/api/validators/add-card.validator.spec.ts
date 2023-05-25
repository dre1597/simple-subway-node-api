import { AddCardValidator } from './add-card.validator';
import {
  MAX_CARD_NAME_LENGTH,
  MIN_CARD_NAME_LENGTH,
} from '../../@core/card/domain/card';

describe('AddCardValidator', () => {
  it('should validate', async () => {
    await AddCardValidator.validate('any_name', 0);

    await AddCardValidator.validate('any_name');

    await expect(async () => {
      await AddCardValidator.validate('');
    }).rejects.toThrow('name is a required field');

    await expect(async () => {
      await AddCardValidator.validate('    ');
    }).rejects.toThrow('name is a required field');

    await expect(async () => {
      await AddCardValidator.validate('an');
    }).rejects.toThrow(
      `name must be at least ${MIN_CARD_NAME_LENGTH} characters`,
    );

    await expect(async () => {
      await AddCardValidator.validate('a'.repeat(MAX_CARD_NAME_LENGTH + 1));
    }).rejects.toThrow(
      `name must be at most ${MAX_CARD_NAME_LENGTH} characters`,
    );
  });
});
