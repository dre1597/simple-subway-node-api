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

export type FindStationByIdInputDto = {
  id: number;
};

export type FindStationByIdOutputDto = {
  station: {
    id: number;
    name: string;
    line: string;
  };
};

export type UpdateStationInputDto = {
  id: number;
  name?: string;
  line?: string;
};

export type RemoveStationInputDto = {
  id: number;
};

export interface StationFacadeInterface {
  add(input: AddStationInputDto): Promise<void>;

  findAll(): Promise<FindAllStationsOutputDto>;

  findById(input: FindStationByIdInputDto): Promise<FindStationByIdOutputDto>;

  update(input: UpdateStationInputDto): Promise<void>;

  remove(input: RemoveStationInputDto): Promise<void>;

  removeAll(): Promise<void>;

  restoreAll(): Promise<void>;
}
