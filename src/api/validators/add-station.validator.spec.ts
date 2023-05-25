import { AddStationValidator } from './add-station.validator';

describe('AddStationValidator', () => {
  it('should validate', async () => {
    await AddStationValidator.validate('any_name', 'any_line');

    await expect(async () => {
      await AddStationValidator.validate('', 'any_line');
    }).rejects.toThrow('name is a required field');

    await expect(async () => {
      await AddStationValidator.validate('    ', 'any_line');
    }).rejects.toThrow('name is a required field');

    await expect(async () => {
      await AddStationValidator.validate('any_name', '');
    }).rejects.toThrow('line is a required field');

    await expect(async () => {
      await AddStationValidator.validate('any_name', '    ');
    }).rejects.toThrow('line is a required field');

    await expect(async () => {
      await AddStationValidator.validate('an', 'any_line');
    }).rejects.toThrow('name must be at least 3 characters');

    await expect(async () => {
      await AddStationValidator.validate('any_name', 'an');
    }).rejects.toThrow('line must be at least 3 characters');

    await expect(async () => {
      await AddStationValidator.validate('a'.repeat(33), 'an_line');
    }).rejects.toThrow('name must be at most 32 characters');

    await expect(async () => {
      await AddStationValidator.validate('any_name', 'a'.repeat(33));
    }).rejects.toThrow('line must be at most 32 characters');
  });
});
