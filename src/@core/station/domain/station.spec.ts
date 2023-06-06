import { InvalidFieldException } from '#shared/domain/exception/invalid-field.exception';

import {
  CreateStationInput,
  MAX_STATION_LINE_LENGTH,
  MAX_STATION_NAME_LENGTH,
  MIN_STATION_LINE_LENGTH,
  MIN_STATION_NAME_LENGTH,
  Station,
} from './station';

describe('Station', () => {
  it('should be able to create a new station', () => {
    let input: CreateStationInput = {
      name: 'any_station1',
      line: 'any_line1',
    };

    const station = new Station(input);

    expect(station.name).toBe(input.name);
    expect(station.line).toBe(input.line);
    expect(station.isDeleted).toBe(false);

    input = {
      id: 2,
      name: 'any_station2',
      line: 'any_line2',
    };

    const stationWithId = new Station(input);

    expect(stationWithId.id).toBe(input.id);
    expect(stationWithId.name).toBe(input.name);
    expect(stationWithId.line).toBe(input.line);
    expect(stationWithId.isDeleted).toBe(false);

    input = {
      id: 3,
      name: 'any_station3',
      line: 'any_line3',
      isDeleted: true,
    };

    const stationWithDeleted = new Station(input);

    expect(stationWithDeleted.id).toBe(input.id);
    expect(stationWithDeleted.name).toBe(input.name);
    expect(stationWithDeleted.line).toBe(input.line);
    expect(stationWithDeleted.isDeleted).toBe(true);
  });

  it('should not be able to create a new station with invalid name', () => {
    const input = {
      name: '',
      line: 'any_line',
    };

    expect(() => new Station(input)).toThrowError(
      new InvalidFieldException(
        'name',
        `Name must be between ${MIN_STATION_NAME_LENGTH} and ${MAX_STATION_NAME_LENGTH} characters long`,
      ),
    );

    input.name = 'a'.repeat(MAX_STATION_NAME_LENGTH + 1);

    expect(() => new Station(input)).toThrowError(
      new InvalidFieldException(
        'name',
        `Name must be between ${MIN_STATION_NAME_LENGTH} and ${MAX_STATION_NAME_LENGTH} characters long`,
      ),
    );
  });

  it('should not be able to create a new station with invalid line', () => {
    const input = {
      name: 'any_station',
      line: '',
    };

    expect(() => new Station(input)).toThrowError(
      new InvalidFieldException(
        'line',
        `Line must be between ${MIN_STATION_LINE_LENGTH} and ${MAX_STATION_LINE_LENGTH} characters long`,
      ),
    );

    input.line = 'a'.repeat(MAX_STATION_LINE_LENGTH + 1);

    expect(() => new Station(input)).toThrowError(
      new InvalidFieldException(
        'line',
        `Line must be between ${MIN_STATION_LINE_LENGTH} and ${MAX_STATION_LINE_LENGTH} characters long`,
      ),
    );
  });

  it('should be able to update a station', () => {
    const input: CreateStationInput = {
      name: 'any_station',
      line: 'any_line',
    };

    const station = new Station(input);

    station.update({
      name: 'updated_name',
      line: 'updated_line',
    });

    expect(station.name).toBe('updated_name');
    expect(station.line).toBe('updated_line');
  });

  it('should not be able to update a station with invalid name', () => {
    const input: CreateStationInput = {
      name: 'any_station',
      line: 'any_line',
    };

    const station = new Station(input);

    expect(() =>
      station.update({
        name: '',
        line: 'any_line',
      }),
    ).toThrowError(
      new InvalidFieldException(
        'name',
        `Name must be between ${MIN_STATION_NAME_LENGTH} and ${MAX_STATION_NAME_LENGTH} characters long`,
      ),
    );
  });

  it('should not be able to update a station with invalid line', () => {
    const input: CreateStationInput = {
      name: 'any_station',
      line: 'any_line',
    };

    const station = new Station(input);

    expect(() =>
      station.update({
        name: 'any_station',
        line: '',
      }),
    ).toThrowError(
      new InvalidFieldException(
        'line',
        `Line must be between ${MIN_STATION_LINE_LENGTH} and ${MAX_STATION_LINE_LENGTH} characters long`,
      ),
    );
  });

  it('should mark is deleted as true when deleted', () => {
    const input: CreateStationInput = {
      name: 'any_station',
      line: 'any_line',
    };

    const station = new Station(input);

    station.delete();

    expect(station.isDeleted).toBe(true);
  });

  it('should not mark is deleted as true when not deleted', () => {
    const input: CreateStationInput = {
      name: 'any_station',
      line: 'any_line',
      isDeleted: true,
    };

    const station = new Station(input);

    expect(station.isDeleted).toBe(true);

    station.restore();

    expect(station.isDeleted).toBe(false);
  });
});
