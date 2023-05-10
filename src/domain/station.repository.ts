import { Station } from './station';

export type CreateStationInputDto = {
  station: Station;
};

export type CreateStationOutputDto = {
  station: Station;
};

export interface StationRepository {
  insert(input: CreateStationInputDto): Promise<CreateStationOutputDto>;
}
