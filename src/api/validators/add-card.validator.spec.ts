import { AddCardValidator } from './add-card.validator';

describe('AddCardValidator', () => {
  it('should validate', async () => {
    await expect(async () => {
      await AddCardValidator.validate('any_name', 0);
    }).not.toThrow();

    await expect(async () => {
      await AddCardValidator.validate('any_name');
    }).not.toThrow();

    await expect(async () => {
      await AddCardValidator.validate('');
    }).rejects.toThrow('name is a required field');

    await expect(async () => {
      await AddCardValidator.validate('    ');
    }).rejects.toThrow('name is a required field');

    await expect(async () => {
      await AddCardValidator.validate('an');
    }).rejects.toThrow('name must be at least 3 characters');

    await expect(async () => {
      await AddCardValidator.validate('a'.repeat(33));
    }).rejects.toThrow('name must be at most 32 characters');
  });
});
