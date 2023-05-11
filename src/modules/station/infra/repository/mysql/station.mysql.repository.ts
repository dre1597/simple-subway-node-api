import {
  FindAllStationsOutputDto,
  FindOneStationInputDto,
  FindOneStationOutputDto,
  SaveStationInputDto,
  SaveStationOutputDto,
  StationRepository,
  VerifyNameAlreadyExistsInputDto,
} from '../../../domain/station.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';
import { Station } from '../../../domain/station';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';

export class StationMysqlRepository implements StationRepository {
  private connection: MySQLConnection;

  constructor() {
    this.connection = MySQLConnection.getInstance();
  }

  public async save({
    station,
  }: SaveStationInputDto): Promise<SaveStationOutputDto> {
    if (!station.id) {
      const stationCreated = await this.connection.query(
        'INSERT INTO stations (name, line) VALUES (?, ?)',
        [station.name, station.line],
      );

      station.id = stationCreated.insertId;
    } else {
      await this.connection.query(
        'UPDATE stations SET name = ?, line = ? WHERE id = ?',
        [station.name, station.line, station.id],
      );
    }

    return {
      station: new Station({
        id: station.id,
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

  public async findById(
    input: FindOneStationInputDto,
  ): Promise<FindOneStationOutputDto> {
    const [station] = await this.connection.query(
      'SELECT * FROM stations WHERE id = ?',
      [input.id],
    );

    if (!station) {
      throw new NotFoundException(
        'Station',
        `Station with id ${input.id} not found`,
      );
    }

    return {
      station: new Station({
        id: station.id,
        name: station.name,
        line: station.line,
      }),
    };
  }

  public async verifyNameAlreadyExists({
    name,
    id,
  }: VerifyNameAlreadyExistsInputDto): Promise<boolean> {
    const query: { statement: string; params: (number | string)[] } = {
      statement: 'SELECT * FROM stations WHERE name = ?',
      params: [name],
    };

    if (id) {
      query.statement += ' AND id <> ?';
      query.params.push(id);
    }

    const stationAlreadyExists = await this.connection.query(
      query.statement,
      query.params,
    );

    return stationAlreadyExists.length > 0;
  }
}
