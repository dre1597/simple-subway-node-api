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

export interface StationRepository {
  insert(input: InsertStationInputDto): Promise<InsertStationOutputDto>;

  findAll(): Promise<FindAllStationsOutputDto>;
}
