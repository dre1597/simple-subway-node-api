import {
  CreateStationInputDto,
  CreateStationOutputDto,
  StationRepository,
} from '../../domain/station.repository';
import { Station } from '../../domain/station';

export class StationInMemoryRepository implements StationRepository {
  private _stations: Station[] = [];

  public async insert({
    station,
  }: CreateStationInputDto): Promise<CreateStationOutputDto> {
    station.id = this._stations[this._stations.length - 1]
      ? this._stations[this._stations.length - 1].id + 1
      : 1;

    this._stations.push(station);

    return {
      station,
    };
  }
}
