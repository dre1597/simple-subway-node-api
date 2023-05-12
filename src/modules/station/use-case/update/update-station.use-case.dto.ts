export type UpdateStationUseCaseInputDto = {
  id: number;
  name?: string;
  line?: string;
};

export type UpdateStationUseCaseOutputDto = {
  id: number;
  name: string;
  line: string;
};
