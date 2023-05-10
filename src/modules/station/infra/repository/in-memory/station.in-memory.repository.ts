import {
  InsertStationInputDto,
  InsertStationOutputDto,
  StationRepository,
} from '../../../domain/station.repository';
import { Station } from '../../../domain/station';
import { UniqueFieldException } from '../../../../@shared/exception/domain/unique-field.exception';

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

  private _verifyStationAlreadyExists(name: string): void {
    const station = this._stations.find((station) => station.name === name);

    if (station) {
      throw new UniqueFieldException('name', 'Name already exists');
    }
  }
}
