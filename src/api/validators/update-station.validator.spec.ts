import {
  MAX_STATION_LINE_LENGTH,
  MAX_STATION_NAME_LENGTH,
  MIN_STATION_LINE_LENGTH,
  MIN_STATION_NAME_LENGTH,
} from '#station/domain/station';

import { UpdateStationValidator } from './update-station.validator';

describe('UpdateStationValidator', () => {
  it('should validate', async () => {
    await UpdateStationValidator.validate();

    await UpdateStationValidator.validate('any_name');

    await UpdateStationValidator.validate('any_name', 'any_line');

    await expect(async () => {
      await UpdateStationValidator.validate('  ', 'any_line');
    }).rejects.toThrow(
      `name must be at least ${MIN_STATION_NAME_LENGTH} characters`,
    );

    await expect(async () => {
      await UpdateStationValidator.validate('any_name', 'an');
    }).rejects.toThrow(
      `line must be at least ${MIN_STATION_LINE_LENGTH} characters`,
    );

    await expect(async () => {
      await UpdateStationValidator.validate(
        'a'.repeat(MAX_STATION_NAME_LENGTH + 1),
        'any_line',
      );
    }).rejects.toThrow(
      `name must be at most ${MAX_STATION_NAME_LENGTH} characters`,
    );

    await expect(async () => {
      await UpdateStationValidator.validate(
        'any_name',
        'a'.repeat(MAX_STATION_NAME_LENGTH + 1),
      );
    }).rejects.toThrow(
      `line must be at most ${MAX_STATION_LINE_LENGTH} characters`,
    );
  });
});
