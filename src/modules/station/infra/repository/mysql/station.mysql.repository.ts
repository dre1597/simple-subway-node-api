import {
  FindAllStationsOutputDto,
  FindOneByIdStationInputDto,
  FindOneByNameStationInputDto,
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
        'INSERT INTO stations (name, line, is_deleted) VALUES (?, ?, ?)',
        [station.name, station.line, station.isDeleted],
      );

      station.id = stationCreated.insertId;
    } else {
      await this.connection.query(
        'UPDATE stations SET name = ?, line = ?, is_deleted = ? WHERE id = ?',
        [station.name, station.line, station.isDeleted, station.id],
      );
    }

    return {
      station: new Station({
        id: station.id,
        name: station.name,
        line: station.line,
        isDeleted: station.isDeleted,
      }),
    };
  }

  public async findAll(): Promise<FindAllStationsOutputDto> {
    const stations = await this.connection.query(
      'SELECT * FROM current_stations',
    );

    return {
      stations: stations.map(
        (station) =>
          new Station({
            id: station.id,
            name: station.name,
            line: station.line,
            isDeleted: station.is_deleted,
          }),
      ),
    };
  }

  public async findById(
    input: FindOneByIdStationInputDto,
  ): Promise<FindOneStationOutputDto> {
    const [station] = await this.connection.query(
      'SELECT * FROM current_stations WHERE id = ?',
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
        isDeleted: station.is_deleted,
      }),
    };
  }

  public async findByName(
    input: FindOneByNameStationInputDto,
  ): Promise<FindOneStationOutputDto> {
    const [station] = await this.connection.query(
      'SELECT * FROM stations WHERE name = ?',
      [input.name],
    );

    if (!station) {
      throw new NotFoundException(
        'Station',
        `Station with name ${input.name} not found`,
      );
    }

    return {
      station: new Station({
        id: station.id,
        name: station.name,
        line: station.line,
        isDeleted: station.isDeleted,
      }),
    };
  }

  public async verifyNameAlreadyExists({
    name,
    id,
  }: VerifyNameAlreadyExistsInputDto): Promise<boolean> {
    const query: { statement: string; params: (number | string)[] } = {
      statement: 'SELECT name FROM stations WHERE name = ?',
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
