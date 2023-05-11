import { Station } from './station';

export type SaveStationInputDto = {
  station: Station;
};

export type SaveStationOutputDto = {
  station: Station;
};

export type FindAllStationsOutputDto = {
  stations: Station[];
};

export type FindOneStationInputDto = {
  id: number;
};

export type FindOneStationOutputDto = {
  station: Station;
};

export type VerifyNameAlreadyExistsInputDto = {
  name: string;
  id?: number;
};

export interface StationRepository {
  save(input: SaveStationInputDto): Promise<SaveStationOutputDto>;

  findAll(): Promise<FindAllStationsOutputDto>;

  findById(input: FindOneStationInputDto): Promise<FindOneStationOutputDto>;

  verifyNameAlreadyExists(
    input: VerifyNameAlreadyExistsInputDto,
  ): Promise<boolean>;
}
