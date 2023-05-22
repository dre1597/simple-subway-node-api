import { StationRepository } from '../../../domain/station.repository';
import { RemoveStationUseCaseInputDto } from './remove-station.use-case.dto';
import { UseCaseInterface } from '../../../../@seedwork/use-case.interface';

export class RemoveStationUseCase implements UseCaseInterface {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(input: RemoveStationUseCaseInputDto): Promise<void> {
    const { station } = await this.stationRepository.findById({ id: input.id });

    station.delete();

    await this.stationRepository.save({
      station,
    });
  }
}
