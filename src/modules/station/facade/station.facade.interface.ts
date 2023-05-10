export type AddStationInputDto = {
  name: string;
  line: string;
};

export type FindAllStationsOutputDto = {
  stations: {
    id: number;
    name: string;
    line: string;
  }[];
};

export interface StationFacadeInterface {
  add(input: AddStationInputDto): Promise<void>;

  findAll(): Promise<FindAllStationsOutputDto>;
}
