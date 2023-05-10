import {
  InsertStationInputDto,
  InsertStationOutputDto,
  StationRepository,
} from '../../domain/station.repository';
import { MySQLConnection } from '../db/mysql-connection';
import { Station } from '../../domain/station';

export class StationMysqlRepository implements StationRepository {
  private connection: MySQLConnection;

  constructor() {
    this.connection = MySQLConnection.getInstance();
  }

  public async insert({
    station,
  }: InsertStationInputDto): Promise<InsertStationOutputDto> {
    const result = await this.connection.query(
      'INSERT INTO stations (name, line) VALUES (?, ?)',
      [station.name, station.line],
    );

    return {
      station: new Station({
        id: result.insertId,
        name: station.name,
        line: station.line,
      }),
    };
  }
}
