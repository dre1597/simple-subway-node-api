import { StationRepository } from '../../../domain/station.repository';

export class RemoveAllStationsUseCase {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(): Promise<void> {
    await this.stationRepository.deleteAll();
  }
}
