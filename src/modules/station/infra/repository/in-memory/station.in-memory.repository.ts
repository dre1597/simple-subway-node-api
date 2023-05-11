import {
  FindAllStationsOutputDto,
  FindOneStationInputDto,
  FindOneStationOutputDto,
  InsertStationInputDto,
  InsertStationOutputDto,
  StationRepository,
  UpdateStationInputDto,
  UpdateStationOutputDto,
} from '../../../domain/station.repository';
import { Station } from '../../../domain/station';
import { UniqueFieldException } from '../../../../@shared/exception/domain/unique-field.exception';
import { NotFoundException } from '../../../../@shared/exception/infra/not-found.exception';

export class StationInMemoryRepository implements StationRepository {
  private _stations: Station[] = [];

  public async insert({
    station,
  }: InsertStationInputDto): Promise<InsertStationOutputDto> {
    this._verifyStationAlreadyExists(station.name);

    station.id = this._stations[this._stations.length - 1]
      ? this._stations[this._stations.length - 1].id + 1
      : 1;

    this._stations.push(station);

    return {
      station,
    };
  }

  public async findAll(): Promise<FindAllStationsOutputDto> {
    return {
      stations: this._stations,
    };
  }

  public async findOne(
    input: FindOneStationInputDto,
  ): Promise<FindOneStationOutputDto> {
    const station = this._stations.find((station) => station.id === input.id);

    if (!station) {
      throw new NotFoundException(
        'Station',
        `Station with id ${input.id} not found`,
      );
    }

    return {
      station,
    };
  }

  public async update({
    id,
    station,
  }: UpdateStationInputDto): Promise<UpdateStationOutputDto> {
    const stationFound = (await this.findOne({ id })).station;

    this._verifyStationAlreadyExists(station.name, station.id);

    stationFound.update({
      name: station.name,
      line: station.line,
    });

    return {
      station: stationFound,
    };
  }

  private _verifyStationAlreadyExists(name: string, id?: number): void {
    const station = this._stations.find((station) => station.name === name);

    if (station && station.id !== id) {
      throw new UniqueFieldException('name', 'Name already exists');
    }
  }
}
