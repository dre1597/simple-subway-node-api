import { StationRepository } from '../../../domain/station.repository';

export class RestoreAllStationUseCase {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(): Promise<void> {
    await this.stationRepository.restoreAll();
  }
}
