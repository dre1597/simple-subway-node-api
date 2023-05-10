import { beforeEach, describe, expect, it } from 'vitest';
import { config } from 'dotenv';

import { Station } from '../../../domain/station';
import { StationMysqlRepository } from './station.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';

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
});
