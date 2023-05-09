import { StationRepository } from '../../domain/station.repository';

export type CreateStationInputDto = {
  name: string;
  line: string;
};

export type CreateStationOutputDto = {
  id: number;
  name: string;
  line: string;
};

export class CreateStationUseCase {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(input: CreateStationInputDto): Promise<CreateStationOutputDto> {
    const output = await this.stationRepository.create(input);

    return {
      id: output.id,
      name: output.name,
      line: output.line,
    };
  }
}
