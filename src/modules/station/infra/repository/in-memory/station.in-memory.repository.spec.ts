import { describe, expect, it } from 'vitest';

import { StationInMemoryRepository } from './station.in-memory.repository';
import { CreateStationInput, Station } from '../../../domain/station';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';

describe('StationInMemoryRepository', () => {
  it('should insert a station', async () => {
    const repository = new StationInMemoryRepository();

    const props: CreateStationInput = {
      name: 'any_name1',
      line: 'any_line1',
    };

    let station = new Station(props);

    let stationInserted = (
      await repository.save({
        station,
      })
    ).station;

    expect(stationInserted.id).toBe(1);
    expect(stationInserted.name).toBe(props.name);
    expect(stationInserted.line).toBe(props.line);
    expect(stationInserted.isDeleted).toBe(false);

    props.name = 'any_name2';
    props.line = 'any_line2';
    props.isDeleted = true;

    station = new Station(props);

    stationInserted = (
      await repository.save({
        station,
      })
    ).station;

    expect(stationInserted.id).toBe(2);
    expect(stationInserted.name).toBe(props.name);
    expect(stationInserted.line).toBe(props.line);
    expect(stationInserted.isDeleted).toBe(props.isDeleted);
  });

  it('should verify a station name already exists', async () => {
    const repository = new StationInMemoryRepository();

    const props = {
      name: 'any_name1',
      line: 'any_line1',
    };

    let stationFound = await repository.verifyNameAlreadyExists({
      name: props.name,
    });

    expect(stationFound.alreadyExists).toBe(false);

    const stationInserted = await repository.save({
      station: new Station(props),
    });

    stationFound = await repository.verifyNameAlreadyExists({
      name: props.name,
    });

    expect(stationFound.alreadyExists).toBe(true);

    stationFound = await repository.verifyNameAlreadyExists({
      name: props.name,
      id: stationInserted.station.id,
    });

    expect(stationFound.alreadyExists).toBe(false);
  });

  it('should find all non deleted stations', async () => {
    const repository = new StationInMemoryRepository();

    await repository.save({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    await repository.save({
      station: new Station({
        name: 'any_name2',
        line: 'any_line2',
      }),
    });

    await repository.save({
      station: new Station({
        name: 'any_name3',
        line: 'any_line3',
        isDeleted: true,
      }),
    });

    const { stations } = await repository.findAll();

    expect(stations.length).toBe(2);
    expect(stations[0].id).toBe(1);
    expect(stations[0].name).toBe('any_name1');
    expect(stations[0].line).toBe('any_line1');

    expect(stations[1].id).toBe(2);
    expect(stations[1].name).toBe('any_name2');
    expect(stations[1].line).toBe('any_line2');
  });

  it('should return an empty array if there is no active stations', async () => {
    const repository = new StationInMemoryRepository();

    const { stations } = await repository.findAll();

    expect(stations).toEqual([]);

    await repository.save({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
        isDeleted: true,
      }),
    });

    const { stations: stationsAfterAddDeleted } = await repository.findAll();

    expect(stationsAfterAddDeleted).toEqual([]);
  });

  it('should find a station by id', async () => {
    const repository = new StationInMemoryRepository();

    await repository.save({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    const { station } = await repository.findById({
      id: 1,
    });

    expect(station.id).toBe(1);
    expect(station.name).toBe('any_name1');
    expect(station.line).toBe('any_line1');
  });

  it('should throw if the station founded is deleted', async () => {
    const repository = new StationInMemoryRepository();

    await repository.save({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
        isDeleted: true,
      }),
    });

    const input = {
      id: 1,
    };

    await expect(async () => {
      await repository.findById({
        id: input.id,
      });
    }).rejects.toThrow(
      new NotFoundException('Station', `Station with id ${input.id} not found`),
    );
  });

  it('should throw if not find a station by id', async () => {
    const repository = new StationInMemoryRepository();

    const input = {
      id: 1,
    };

    await expect(async () => {
      await repository.findById(input);
    }).rejects.toThrow(
      new NotFoundException('Station', `Station with id ${input.id} not found`),
    );
  });

  it('should find a station by name', async () => {
    const repository = new StationInMemoryRepository();

    await repository.save({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    const { station } = await repository.findByName({
      name: 'any_name1',
    });

    expect(station.id).toBe(1);
    expect(station.name).toBe('any_name1');
    expect(station.line).toBe('any_line1');
  });

  it('should throw if not find a station by name', async () => {
    const repository = new StationInMemoryRepository();

    const input = {
      name: 'any_name1',
    };

    await expect(async () => {
      await repository.findByName(input);
    }).rejects.toThrow(
      new NotFoundException(
        'Station',
        `Station with name ${input.name} not found`,
      ),
    );
  });

  it('should update a station', async () => {
    const repository = new StationInMemoryRepository();

    const { station: insertedStation } = await repository.save({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    insertedStation.update({
      name: 'updated_name1',
      line: 'updated_name2',
    });

    const { station } = await repository.save({
      station: insertedStation,
    });

    expect(station.id).toBe(insertedStation.id);
    expect(station.name).toBe('updated_name1');
    expect(station.line).toBe('updated_name2');
  });

  it('should delete a station', async () => {
    const repository = new StationInMemoryRepository();

    await repository.save({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    await repository.delete({
      id: 1,
    });

    const { station, alreadyExists } = await repository.verifyNameAlreadyExists(
      {
        name: 'any_name1',
      },
    );

    expect(alreadyExists).toBeFalsy();
    expect(station).toBeNull();
  });
});
