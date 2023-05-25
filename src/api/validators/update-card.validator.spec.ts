import { UpdateCardValidator } from './update-card.validator';

describe('UpdateCardValidator', () => {
  it('should validate', async () => {
    await UpdateCardValidator.validate();

    await UpdateCardValidator.validate('any_name');

    await UpdateCardValidator.validate('any_name', 0);

    await expect(async () => {
      await UpdateCardValidator.validate('    ');
    }).rejects.toThrow('name must be at least 3 characters');

    await expect(async () => {
      await UpdateCardValidator.validate('an');
    }).rejects.toThrow('name must be at least 3 characters');

    await expect(async () => {
      await UpdateCardValidator.validate('a'.repeat(33));
    }).rejects.toThrow('name must be at most 32 characters');
  });
});
