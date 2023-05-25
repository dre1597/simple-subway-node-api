import { config } from 'dotenv';

import { NotFoundException } from '../../../../@shared/exception/not-found.exception';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql/mysql-connection';
import { CreateStationInput, Station } from '../../../domain/station';
import { StationMysqlRepository } from './station.mysql.repository';

config();

const makeSut = () => {
  return new StationMysqlRepository();
};

describe('StationMysqlRepository', () => {
  const connection = MySQLConnection.getInstance();

  const truncateTable = async () => {
    const database = process.env.DB_DATABASE_TEST;

    await connection.query(`TRUNCATE TABLE \`${database}\`.\`stations\``);
  };

  beforeEach(async () => {
    await truncateTable();
  });

  afterEach(async () => {
    await truncateTable();
  });

  it('should insert a station', async () => {
    const repository = makeSut();

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
    const repository = makeSut();

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
    const repository = makeSut();

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
    const repository = makeSut();

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
    const repository = makeSut();

    await repository.save({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    const { station } = await repository.findById({ id: 1 });

    expect(station.id).toBe(1);
    expect(station.name).toBe('any_name1');
    expect(station.line).toBe('any_line1');
  });

  it('should throw if the station founded is deleted', async () => {
    const repository = makeSut();

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
    const repository = makeSut();

    const input = { id: 1 };

    await expect(async () => {
      await repository.findById(input);
    }).rejects.toThrow(
      new NotFoundException('Station', `Station with id ${input.id} not found`),
    );
  });

  it('should find a station by name', async () => {
    const repository = makeSut();

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
    const repository = makeSut();

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
    const repository = makeSut();

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
    const repository = makeSut();

    const { station: insertedStation } = await repository.save({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    await repository.delete({ id: insertedStation.id });

    const { station, alreadyExists } = await repository.verifyNameAlreadyExists(
      {
        name: insertedStation.name,
      },
    );

    expect(alreadyExists).toBeFalsy();
    expect(station).toBeNull();
  });

  it('should delete all stations', async () => {
    const repository = makeSut();

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

    const { stations } = await repository.findAll();

    expect(stations).toHaveLength(2);
    expect(stations[0].isDeleted).toBe(false);
    expect(stations[1].isDeleted).toBe(false);

    await repository.deleteAll();

    const { stations: stationsAfterDeleteAll } = await repository.findAll();

    expect(stationsAfterDeleteAll).toHaveLength(0);
  });

  it('should restore all stations', async () => {
    const repository = makeSut();

    await repository.save({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
        isDeleted: true,
      }),
    });

    await repository.save({
      station: new Station({
        name: 'any_name2',
        line: 'any_line2',
        isDeleted: true,
      }),
    });

    const { stations } = await repository.findAll();

    expect(stations).toHaveLength(0);

    await repository.restoreAll();

    const { stations: stationsAfterRestoreAll } = await repository.findAll();

    expect(stationsAfterRestoreAll).toHaveLength(2);
    expect(stationsAfterRestoreAll[0].isDeleted).toBe(false);
    expect(stationsAfterRestoreAll[1].isDeleted).toBe(false);
  });
});
