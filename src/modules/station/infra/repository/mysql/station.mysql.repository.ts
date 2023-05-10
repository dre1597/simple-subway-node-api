import {
  FindAllStationsOutputDto,
  InsertStationInputDto,
  InsertStationOutputDto,
  StationRepository,
} from '../../../domain/station.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';
import { Station } from '../../../domain/station';
import { UniqueFieldException } from '../../../../@shared/exception/domain/unique-field.exception';

export class StationMysqlRepository implements StationRepository {
  private connection: MySQLConnection;

  constructor() {
    this.connection = MySQLConnection.getInstance();
  }

  public async insert({
    station,
  }: InsertStationInputDto): Promise<InsertStationOutputDto> {
    await this._verifyStationAlreadyExists(station.name);

    const stationCreated = await this.connection.query(
      'INSERT INTO stations (name, line) VALUES (?, ?)',
      [station.name, station.line],
    );

    return {
      station: new Station({
        id: stationCreated.insertId,
        name: station.name,
        line: station.line,
      }),
    };
  }

  public async findAll(): Promise<FindAllStationsOutputDto> {
    const stations = await this.connection.query('SELECT * FROM stations');

    return {
      stations: stations.map(
        (station) =>
          new Station({
            id: station.id,
            name: station.name,
            line: station.line,
          }),
      ),
    };
  }

  private async _verifyStationAlreadyExists(name: string): Promise<void> {
    const stationAlreadyExists = await this.connection.query(
      'SELECT name FROM stations WHERE name = ?',
      [name],
    );

    if (stationAlreadyExists.length > 0) {
      throw new UniqueFieldException('name', 'Name already exists');
    }
  }
}
