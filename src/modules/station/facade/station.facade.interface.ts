export interface AddStationInputDto {
  name: string;
  line: string;
}

export interface StationFacadeInterface {
  add(input: AddStationInputDto): Promise<void>;
}
