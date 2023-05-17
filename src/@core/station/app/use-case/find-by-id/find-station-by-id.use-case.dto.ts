export type FindStationByIdUseCaseInputDto = {
  id: number;
};

export type FindStationByIdUseCaseOutputDto = {
  station: {
    id: number;
    name: string;
    line: string;
  };
};
