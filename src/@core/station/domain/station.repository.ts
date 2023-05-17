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

export type FindOneByIdStationInputDto = {
  id: number;
};

export type FindOneByNameStationInputDto = {
  name: string;
};

export type FindOneStationOutputDto = {
  station: Station;
};

export type VerifyNameAlreadyExistsInputDto = {
  name: string;
  id?: number;
};

export type VerifyNameAlreadyExistsOutputDto = {
  station: Station;
  alreadyExists: boolean;
};

export type DeleteStationInputDto = {
  id: number;
};

export interface StationRepository {
  save(input: SaveStationInputDto): Promise<SaveStationOutputDto>;

  findAll(): Promise<FindAllStationsOutputDto>;

  findById(input: FindOneByIdStationInputDto): Promise<FindOneStationOutputDto>;

  findByName(
    input: FindOneByNameStationInputDto,
  ): Promise<FindOneStationOutputDto>;

  verifyNameAlreadyExists(
    input: VerifyNameAlreadyExistsInputDto,
  ): Promise<VerifyNameAlreadyExistsOutputDto>;

  delete(input: DeleteStationInputDto): Promise<void>;

  deleteAll(): Promise<void>;

  restoreAll(): Promise<void>;
}
