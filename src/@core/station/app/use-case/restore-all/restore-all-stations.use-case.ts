import { UseCaseInterface } from '#shared/app/use-case.interface';

import { StationRepository } from '../../../domain/station.repository';

export class RestoreAllStationsUseCase implements UseCaseInterface {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(): Promise<void> {
    await this.stationRepository.restoreAll();
  }
}
