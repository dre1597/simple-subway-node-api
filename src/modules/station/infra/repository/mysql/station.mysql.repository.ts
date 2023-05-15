import {
  DeleteStationInputDto,
  FindAllStationsOutputDto,
  FindOneByIdStationInputDto,
  FindOneByNameStationInputDto,
  FindOneStationOutputDto,
  SaveStationInputDto,
  SaveStationOutputDto,
  StationRepository,
  VerifyNameAlreadyExistsInputDto,
  VerifyNameAlreadyExistsOutputDto,
} from '../../../domain/station.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';
import { Station } from '../../../domain/station';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';

export class StationMysqlRepository implements StationRepository {
  private connection: MySQLConnection;

  constructor() {
    this.connection = MySQLConnection.getInstance();
  }

  public async save(input: SaveStationInputDto): Promise<SaveStationOutputDto> {
    if (!input.station.id) {
      const stationCreated = await this.connection.query(
        'INSERT INTO stations (name, line, is_deleted) VALUES (?, ?, ?)',
        [input.station.name, input.station.line, input.station.isDeleted],
      );

      input.station.id = stationCreated.insertId;
    } else {
      await this.connection.query(
        'UPDATE stations SET name = ?, line = ?, is_deleted = ? WHERE id = ?',
        [
          input.station.name,
          input.station.line,
          input.station.isDeleted,
          input.station.id,
        ],
      );
    }

    return {
      station: new Station({
        id: input.station.id,
        name: input.station.name,
        line: input.station.line,
        isDeleted: input.station.isDeleted,
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
            isDeleted: !!station.is_deleted,
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
        isDeleted: !!station.is_deleted,
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
        isDeleted: !!station.is_deleted,
      }),
    };
  }

  public async verifyNameAlreadyExists(
    input: VerifyNameAlreadyExistsInputDto,
  ): Promise<VerifyNameAlreadyExistsOutputDto> {
    let alreadyExists = false;

    const [stationFound] = await this.connection.query(
      'SELECT * FROM stations WHERE name = ?',
      [input.name],
    );

    if (stationFound && stationFound.id !== input.id) {
      alreadyExists = true;
    }

    return {
      station: stationFound
        ? new Station({
            id: stationFound.id,
            name: stationFound.name,
            line: stationFound.line,
            isDeleted: !!stationFound.is_deleted,
          })
        : null,
      alreadyExists,
    };
  }

  public async delete(input: DeleteStationInputDto): Promise<void> {
    await this.connection.query('DELETE FROM stations WHERE id = ?', [
      input.id,
    ]);
  }
}
