import { Station } from '../../domain/station';
import {
  CreateStationInputDto,
  CreateStationOutputDto,
  StationRepository,
} from '../../domain/station.repository';

export class StationInMemoryRepository implements StationRepository {
  private _stations: Station[] = [];

  public async create(
    input: CreateStationInputDto,
  ): Promise<CreateStationOutputDto> {
    const station = new Station({
      name: input.name,
      line: input.line,
      id: this._stations[this._stations.length - 1]
        ? this._stations[this._stations.length - 1].id + 1
        : 1,
    });

    this._stations.push(station);

    return {
      id: station.id,
      name: station.name,
      line: station.line,
    };
  }
}
