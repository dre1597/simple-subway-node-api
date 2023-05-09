export type CreateStationInputDto = {
  name: string;
  line: string;
};

export type CreateStationOutputDto = {
  id: number;
  name: string;
  line: string;
};

export interface StationRepository {
  create(input: CreateStationInputDto): Promise<CreateStationOutputDto>;
}
