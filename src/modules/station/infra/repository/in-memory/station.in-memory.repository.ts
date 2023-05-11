import {
  FindAllStationsOutputDto,
  FindOneStationInputDto,
  FindOneStationOutputDto,
  SaveStationInputDto,
  SaveStationOutputDto,
  StationRepository,
  VerifyNameAlreadyExistsInputDto,
} from '../../../domain/station.repository';
import { Station } from '../../../domain/station';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';

export class StationInMemoryRepository implements StationRepository {
  private _stations: Station[] = [];

  public async save({
    station,
  }: SaveStationInputDto): Promise<SaveStationOutputDto> {
    if (!station.id) {
      station.id = this._stations[this._stations.length - 1]
        ? this._stations[this._stations.length - 1].id + 1
        : 1;
    }

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

  public async findById(
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

  public async verifyNameAlreadyExists(
    input: VerifyNameAlreadyExistsInputDto,
  ): Promise<boolean> {
    const station = this._stations.find(
      (station) => station.name === input.name,
    );

    if (station && station.id !== input?.id) {
      return true;
    }

    return false;
  }
}
