import { StationRepository } from '../domain/station.repository';
import { Station } from '../domain/station';
import {
  AddStationUseCaseInputDto,
  AddStationUseCaseOutputDto,
} from './add-station.use-case.dto';

export class AddStationUseCase {
  constructor(private readonly stationRepository: StationRepository) {}

  public async execute(
    input: AddStationUseCaseInputDto,
  ): Promise<AddStationUseCaseOutputDto> {
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
