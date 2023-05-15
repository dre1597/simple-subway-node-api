import { StationRepository } from '../../../domain/station.repository';
import {
  UpdateStationUseCaseInputDto,
  UpdateStationUseCaseOutputDto,
} from './update-station.use-case.dto';
import { UniqueFieldException } from '../../../../@shared/exception/unique-field.exception';

export class UpdateStationUseCase {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(
    input: UpdateStationUseCaseInputDto,
  ): Promise<UpdateStationUseCaseOutputDto> {
    const station = await this.stationRepository.findById({ id: input.id });

    station.station.update({
      name: input.name,
      line: input.line,
    });

    const alreadyExists = await this.stationRepository.verifyNameAlreadyExists({
      name: input.name,
      id: input.id,
    });

    if (alreadyExists) {
      throw new UniqueFieldException('name', 'Name already exists');
    }

    const { station: stationInserted } = await this.stationRepository.save(
      station,
    );

    return {
      id: stationInserted.id,
      name: stationInserted.name,
      line: stationInserted.line,
    };
  }
}
