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
import { Station } from '../../../domain/station';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';

export class StationInMemoryRepository implements StationRepository {
  private _stations: Station[] = [];

  public async save(input: SaveStationInputDto): Promise<SaveStationOutputDto> {
    if (!input.station.id) {
      input.station.id = this._stations[this._stations.length - 1]
        ? this._stations[this._stations.length - 1].id + 1
        : 1;

      this._stations.push(input.station);
    }

    return {
      station: input.station,
    };
  }

  public async findAll(): Promise<FindAllStationsOutputDto> {
    return {
      stations: this._getCurrentStations(),
    };
  }

  public async findById(
    input: FindOneByIdStationInputDto,
  ): Promise<FindOneStationOutputDto> {
    const station = this._getCurrentStations().find(
      (station) => station.id === input.id,
    );

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

  public async findByName(
    input: FindOneByNameStationInputDto,
  ): Promise<FindOneStationOutputDto> {
    const station = this._stations.find(
      (station) => station.name === input.name,
    );

    if (!station) {
      throw new NotFoundException(
        'Station',
        `Station with name ${input.name} not found`,
      );
    }

    return {
      station,
    };
  }

  public async verifyNameAlreadyExists(
    input: VerifyNameAlreadyExistsInputDto,
  ): Promise<VerifyNameAlreadyExistsOutputDto> {
    let alreadyExists = false;

    const stationFound = this._stations.find(
      (station) => station.name === input.name,
    );

    if (stationFound && stationFound.id !== input?.id) {
      alreadyExists = true;
    }

    return {
      station: stationFound ? stationFound : null,
      alreadyExists,
    };
  }

  private _getCurrentStations(): Station[] {
    return this._stations.filter((station) => !station.isDeleted);
  }

  public async delete(input: DeleteStationInputDto): Promise<void> {
    this._stations = this._stations.filter(
      (station) => station.id !== input.id,
    );
  }
}
