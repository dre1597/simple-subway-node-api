import { StationRepository } from '../../domain/station.repository';
import { Station } from '../../domain/station';

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
    const station = new Station({
      name: input.name,
      line: input.line,
    });

    const { station: stationInserted } = await this.stationRepository.insert({
      station,
    });

    return {
      id: stationInserted.id,
      name: stationInserted.name,
      line: stationInserted.line,
    };
  }
}
