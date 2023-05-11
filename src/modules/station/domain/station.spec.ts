import { describe, expect, it } from 'vitest';

import { CreateStationInput, Station } from './station';
import { InvalidFieldException } from '../../@shared/exception/invalid-field.exception';

describe('Station', () => {
  it('should be able to create a new station', () => {
    const input: CreateStationInput = {
      name: 'any_station',
      line: 'any_line',
    };

    const station = new Station(input);

    expect(station.name).toBe(input.name);
    expect(station.line).toBe(input.line);
  });

  it('should not be able to create a new station with invalid name', () => {
    const input = {
      name: '',
      line: 'any_line',
    };

    expect(() => new Station(input)).toThrowError(
      new InvalidFieldException(
        'name',
        'Name must be between 3 and 32 characters long',
      ),
    );

    input.name = 'a'.repeat(33);

    expect(() => new Station(input)).toThrowError(
      new InvalidFieldException(
        'name',
        'Name must be between 3 and 32 characters long',
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
        'Line must be between 3 and 32 characters long',
      ),
    );

    input.line = 'a'.repeat(33);

    expect(() => new Station(input)).toThrowError(
      new InvalidFieldException(
        'line',
        'Line must be between 3 and 32 characters long',
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
        'Name must be between 3 and 32 characters long',
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
        'Line must be between 3 and 32 characters long',
      ),
    );
  });
});
