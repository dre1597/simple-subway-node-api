import { AddStationValidator } from './add-station.validator';
import {
  MAX_STATION_LINE_LENGTH,
  MAX_STATION_NAME_LENGTH,
  MIN_STATION_LINE_LENGTH,
  MIN_STATION_NAME_LENGTH,
} from '../../@core/station/domain/station';

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
    }).rejects.toThrow(
      `name must be at least ${MIN_STATION_NAME_LENGTH} characters`,
    );

    await expect(async () => {
      await AddStationValidator.validate('any_name', 'an');
    }).rejects.toThrow(
      `line must be at least ${MIN_STATION_LINE_LENGTH} characters`,
    );

    await expect(async () => {
      await AddStationValidator.validate(
        'a'.repeat(MAX_STATION_NAME_LENGTH + 1),
        'any_line',
      );
    }).rejects.toThrow(
      `name must be at most ${MAX_STATION_NAME_LENGTH} characters`,
    );

    await expect(async () => {
      await AddStationValidator.validate(
        'any_name',
        'a'.repeat(MAX_STATION_LINE_LENGTH + 1),
      );
    }).rejects.toThrow(
      `line must be at most ${MAX_STATION_LINE_LENGTH} characters`,
    );
  });
});
