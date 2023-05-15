export type FindAllStationsUseCaseOutputDto = {
  stations: {
    id: number;
    name: string;
    line: string;
  }[];
};
