import { beforeEach, describe, expect, it } from 'vitest';
import { config } from 'dotenv';

import { Station } from '../../../domain/station';
import { StationMysqlRepository } from './station.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';
import { UniqueFieldException } from '../../../../@shared/exception/domain/unique-field.exception';

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
    const repository = new StationMysqlRepository();

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
});
