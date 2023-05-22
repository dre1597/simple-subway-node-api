import { StationRepository } from '../../../domain/station.repository';
import { UseCaseInterface } from '../../../../@seedwork/use-case.interface';

export class RemoveAllStationsUseCase implements UseCaseInterface {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(): Promise<void> {
    await this.stationRepository.deleteAll();
  }
}
