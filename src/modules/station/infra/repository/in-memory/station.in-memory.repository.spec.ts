import { describe, expect, it } from 'vitest';

import { StationInMemoryRepository } from './station.in-memory.repository';
import { Station } from '../../../domain/station';
import { UniqueFieldException } from '../../../../@shared/exception/domain/unique-field.exception';

describe('StationInMemoryRepository', () => {
  it('should insert a station', async () => {
    const repository = new StationInMemoryRepository();

    const props = {
      name: 'any_name1',
      line: 'any_line1',
    };

    let station = new Station(props);

    let stationInserted = (
      await repository.insert({
        station,
      })
    ).station;

    expect(stationInserted.id).toBe(1);
    expect(stationInserted.name).toBe(props.name);
    expect(stationInserted.line).toBe(props.line);

    props.name = 'any_name2';
    props.line = 'any_line2';

    station = new Station(props);

    stationInserted = (
      await repository.insert({
        station,
      })
    ).station;

    expect(stationInserted.id).toBe(2);
    expect(stationInserted.name).toBe(props.name);
    expect(stationInserted.line).toBe(props.line);
  });

  it('should not insert a station with the same name', async () => {
    const repository = new StationInMemoryRepository();

    const props = {
      name: 'any_name1',
      line: 'any_line1',
    };

    const station = new Station(props);

    await repository.insert({ station });

    try {
      const station = new Station(props);
      await repository.insert({ station });
    } catch (error) {
      expect(error).toBeInstanceOf(UniqueFieldException);
      expect(error.message).toBe(
        'Unique field: name, details: Name already exists',
      );
    }
  });

  it('should find all stations', async () => {
    const repository = new StationInMemoryRepository();

    await repository.insert({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    await repository.insert({
      station: new Station({
        name: 'any_name2',
        line: 'any_line2',
      }),
    });

    const { stations } = await repository.findAll();

    expect(stations[0].id).toBe(1);
    expect(stations[0].name).toBe('any_name1');
    expect(stations[0].line).toBe('any_line1');

    expect(stations[1].id).toBe(2);
    expect(stations[1].name).toBe('any_name2');
    expect(stations[1].line).toBe('any_line2');
  });

  it('should return an empty array if there is no stations', async () => {
    const repository = new StationInMemoryRepository();

    const { stations } = await repository.findAll();

    expect(stations).toEqual([]);
  });
});
