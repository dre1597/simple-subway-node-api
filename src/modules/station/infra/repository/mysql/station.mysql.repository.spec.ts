import { beforeEach, describe, expect, it } from 'vitest';
import { config } from 'dotenv';

import { Station } from '../../../domain/station';
import { StationMysqlRepository } from './station.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';

config();

describe('StationMysqlRepository', () => {
  beforeEach(() => {
    const connection = MySQLConnection.getInstance();

    const database = process.env.DB_DATABASE_TEST;

    connection.query(`TRUNCATE TABLE \`${database}\`.\`stations\``);
  });

  it('should insert a station', async () => {
    const repository = new StationMysqlRepository();

    const props = {
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

    props.name = 'any_name2';
    props.line = 'any_line2';

    station = new Station(props);

    stationInserted = (
      await repository.save({
        station,
      })
    ).station;

    expect(stationInserted.id).toBe(2);
    expect(stationInserted.name).toBe(props.name);
    expect(stationInserted.line).toBe(props.line);
  });

  it('should verify a station name already exists', async () => {
    const repository = new StationMysqlRepository();

    const props = {
      name: 'any_name1',
      line: 'any_line1',
    };

    let alreadyExists = await repository.verifyNameAlreadyExists({
      name: props.name,
    });

    expect(alreadyExists).toBe(false);

    const stationInserted = await repository.save({
      station: new Station(props),
    });

    alreadyExists = await repository.verifyNameAlreadyExists({
      name: props.name,
    });

    expect(alreadyExists).toBe(true);

    alreadyExists = await repository.verifyNameAlreadyExists({
      name: props.name,
      id: stationInserted.station.id,
    });

    expect(alreadyExists).toBe(false);
  });

  it('should find all stations', async () => {
    const repository = new StationMysqlRepository();

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

    expect(stations[0].id).toBe(1);
    expect(stations[0].name).toBe('any_name1');
    expect(stations[0].line).toBe('any_line1');

    expect(stations[1].id).toBe(2);
    expect(stations[1].name).toBe('any_name2');
    expect(stations[1].line).toBe('any_line2');
  });

  it('should return an empty array if there is no stations', async () => {
    const repository = new StationMysqlRepository();

    const { stations } = await repository.findAll();

    expect(stations).toEqual([]);
  });

  it('should find a station', async () => {
    const repository = new StationMysqlRepository();

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

  it('should throw if not find a station', async () => {
    const repository = new StationMysqlRepository();

    const input = { id: 1 };

    await expect(async () => {
      await repository.findById(input);
    }).rejects.toThrow(
      new NotFoundException('Station', `Station with id ${input.id} not found`),
    );
  });

  it('should update a station', async () => {
    const repository = new StationMysqlRepository();

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
});
