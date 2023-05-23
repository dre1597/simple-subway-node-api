import { UpdateCardValidator } from './update-card.validator';

describe('UpdateCardValidator', () => {
  it('should validate', async () => {
    await expect(async () => {
      await UpdateCardValidator.validate();
    }).not.toThrow();

    await expect(async () => {
      await UpdateCardValidator.validate('any_name');
    }).not.toThrow();

    await expect(async () => {
      await UpdateCardValidator.validate('any_name', 0);
    }).not.toThrow();

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
