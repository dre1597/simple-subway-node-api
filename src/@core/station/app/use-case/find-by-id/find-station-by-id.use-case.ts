import { UseCaseInterface } from '#shared/app/use-case.interface';

import { StationRepository } from '../../../domain/station.repository';
import {
  FindStationByIdUseCaseInputDto,
  FindStationByIdUseCaseOutputDto,
} from './find-station-by-id.use-case.dto';

export class FindStationByIdUseCase implements UseCaseInterface {
  constructor(private readonly stationRepository: StationRepository) {}

  public async execute(
    input: FindStationByIdUseCaseInputDto,
  ): Promise<FindStationByIdUseCaseOutputDto> {
    const { station } = await this.stationRepository.findById({ id: input.id });

    return {
      station: {
        id: station.id,
        name: station.name,
        line: station.line,
      },
    };
  }
}
