import { UseCaseInterface } from '../../../../@seedwork/use-case.interface';
import { StationRepository } from '../../../domain/station.repository';

export class RemoveAllStationsUseCase implements UseCaseInterface {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(): Promise<void> {
    await this.stationRepository.deleteAll();
  }
}
