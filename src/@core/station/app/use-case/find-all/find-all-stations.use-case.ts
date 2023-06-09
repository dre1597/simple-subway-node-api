import { UseCaseInterface } from '#shared/app/use-case.interface';

import { StationRepository } from '../../../domain/station.repository';
import { FindAllStationsUseCaseOutputDto } from './find-all-stations.use-case.dto';

export class FindAllStationsUseCase implements UseCaseInterface {
  constructor(private readonly stationRepository: StationRepository) {}

  public async execute(): Promise<FindAllStationsUseCaseOutputDto> {
    const { stations } = await this.stationRepository.findAll();

    return {
      stations: stations.map((station) => ({
        id: station.id,
        name: station.name,
        line: station.line,
      })),
    };
  }
}
