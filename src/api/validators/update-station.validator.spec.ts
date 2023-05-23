import { UpdateStationValidator } from './update-station.validator';

describe('UpdateStationValidator', () => {
  it('should validate', async () => {
    await expect(async () => {
      await UpdateStationValidator.validate();
    }).not.toThrow();

    await expect(async () => {
      await UpdateStationValidator.validate('any_name');
    }).not.toThrow();

    await expect(async () => {
      await UpdateStationValidator.validate('any_name', 'any_line');
    }).not.toThrow();

    await expect(async () => {
      await UpdateStationValidator.validate('  ', 'any_line');
    }).rejects.toThrow('name must be at least 3 characters');

    await expect(async () => {
      await UpdateStationValidator.validate('any_name', 'an');
    }).rejects.toThrow('line must be at least 3 characters');

    await expect(async () => {
      await UpdateStationValidator.validate('a'.repeat(33), 'any_line');
    }).rejects.toThrow('name must be at most 32 characters');

    await expect(async () => {
      await UpdateStationValidator.validate('any_name', 'a'.repeat(33));
    }).rejects.toThrow('line must be at most 32 characters');
  });
});
