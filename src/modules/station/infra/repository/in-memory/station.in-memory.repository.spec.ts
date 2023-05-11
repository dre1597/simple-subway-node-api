import { describe, expect, it } from 'vitest';

import { StationInMemoryRepository } from './station.in-memory.repository';
import { Station } from '../../../domain/station';
import { UniqueFieldException } from '../../../../@shared/exception/domain/unique-field.exception';
import { NotFoundException } from '../../../../@shared/exception/infra/not-found.exception';
import { InvalidFieldException } from '../../../../@shared/exception/domain/invalid-field.exception';

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

    await expect(async () => {
      const station = new Station(props);
      await repository.insert({ station });
    }).rejects.toThrow(new UniqueFieldException('name', 'Name already exists'));
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

  it('should find one station', async () => {
    const repository = new StationInMemoryRepository();

    await repository.insert({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    const { station } = await repository.findOne({
      id: 1,
    });

    expect(station.id).toBe(1);
    expect(station.name).toBe('any_name1');
    expect(station.line).toBe('any_line1');
  });

  it('should not find one station', async () => {
    const repository = new StationInMemoryRepository();

    const input = {
      id: 1,
    };

    await expect(async () => {
      await repository.findOne(input);
    }).rejects.toThrow(
      new NotFoundException('Station', `Station with id ${input.id} not found`),
    );
  });

  it('should update a station', async () => {
    const repository = new StationInMemoryRepository();

    const { station: insertedStation } = await repository.insert({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    insertedStation.update({
      name: 'updated_name1',
      line: 'updated_name2',
    });

    const { station } = await repository.update({
      id: insertedStation.id,
      station: insertedStation,
    });

    expect(station.id).toBe(insertedStation.id);
    expect(station.name).toBe('updated_name1');
    expect(station.line).toBe('updated_name2');
  });

  it('should not update a station with a invalid name', async () => {
    const repository = new StationInMemoryRepository();

    const { station: insertedStation } = await repository.insert({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    expect(() => {
      insertedStation.update({
        name: '',
        line: 'updated_line1',
      });
    }).toThrowError(
      new InvalidFieldException(
        'name',
        'Name must be between 3 and 32 characters long',
      ),
    );
  });

  it('should not update a station with a invalid line', async () => {
    const repository = new StationInMemoryRepository();

    const { station: insertedStation } = await repository.insert({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    expect(() => {
      insertedStation.update({
        name: 'updated_name1',
        line: '',
      });
    }).toThrowError(
      new InvalidFieldException(
        'line',
        'Line must be between 3 and 32 characters long',
      ),
    );
  });

  it('should not update a station with a duplicated name', async () => {
    const repository = new StationInMemoryRepository();

    await repository.insert({
      station: new Station({
        name: 'unique_name',
        line: 'any_line1',
      }),
    });

    const { station: insertedStation } = await repository.insert({
      station: new Station({
        name: 'any_name1',
        line: 'any_line2',
      }),
    });

    insertedStation.update({
      name: 'unique_name',
      line: 'any_line2',
    });

    await expect(async () => {
      await repository.update({
        id: 1,
        station: insertedStation,
      });
    }).rejects.toThrowError(
      new UniqueFieldException('name', 'Name already exists'),
    );
  });

  it('should not update a not found station', async () => {
    const repository = new StationInMemoryRepository();

    await expect(async () => {
      await repository.update({
        id: 1,
        station: new Station({
          name: 'any_name1',
          line: 'any_line1',
        }),
      });
    }).rejects.toThrowError(
      new NotFoundException('Station', 'Station with id 1 not found'),
    );
  });
});
