import { Station } from './station';

export type InsertStationInputDto = {
  station: Station;
};

export type InsertStationOutputDto = {
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

export type UpdateStationInputDto = {
  id: number;
  station: Station;
};

export type UpdateStationOutputDto = {
  station: Station;
};

export interface StationRepository {
  insert(input: InsertStationInputDto): Promise<InsertStationOutputDto>;

  findAll(): Promise<FindAllStationsOutputDto>;

  findOne(input: FindOneStationInputDto): Promise<FindOneStationOutputDto>;

  update(input: UpdateStationInputDto): Promise<UpdateStationOutputDto>;
}
