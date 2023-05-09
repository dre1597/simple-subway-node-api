import { describe, expect, it } from 'vitest';

import { StationInMemoryRepository } from './station.in-memory.repository';
import { CreateStationInputDto } from '../../domain/station.repository';
import { InvalidFieldException } from '../../domain/invalid-field.exception';

describe('StationInMemoryRepository', () => {
  it('should create a station', async () => {
    const stationRepository = new StationInMemoryRepository();

    const input: CreateStationInputDto = {
      name: 'any_name1',
      line: 'any_line1',
    };

    let output = await stationRepository.create(input);

    expect(output).toEqual({
      id: 1,
      name: 'any_name1',
      line: 'any_line1',
    });

    input.name = 'any_name2';
    input.line = 'any_line2';

    output = await stationRepository.create(input);

    expect(output).toEqual({
      id: 2,
      name: 'any_name2',
      line: 'any_line2',
    });
  });

  it('should not be able to create a new station with invalid name', async () => {
    const stationRepository = new StationInMemoryRepository();

    const input: CreateStationInputDto = {
      name: '',
      line: 'any_line',
    };

    try {
      await stationRepository.create(input);
    } catch (error) {
      expect(error.name).toBe('InvalidFieldException');
      expect(error.message).toBe(
        'Invalid field: name, details: Name must be between 3 and 32 characters long',
      );
    }

    input.name = 'a'.repeat(33);

    try {
      await stationRepository.create(input);
    } catch (error) {
      expect(error.name).toBe('InvalidFieldException');
      expect(error.message).toBe(
        'Invalid field: name, details: Name must be between 3 and 32 characters long',
      );
    }
  });

  it('should not be able to create a new station with invalid line', async () => {
    const stationRepository = new StationInMemoryRepository();

    const input = {
      name: 'any_station',
      line: '',
    };

    try {
      await stationRepository.create(input);
    } catch (error) {
      expect(error.name).toBe('InvalidFieldException');
      expect(error.message).toBe(
        'Invalid field: line, details: Line must be between 3 and 32 characters long',
      );
    }

    input.line = 'a'.repeat(33);

    try {
      await stationRepository.create(input);
    } catch (error) {
      expect(error.name).toBe('InvalidFieldException');
      expect(error.message).toBe(
        'Invalid field: line, details: Line must be between 3 and 32 characters long',
      );
    }
  });
});
