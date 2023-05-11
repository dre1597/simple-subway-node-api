import { StationRepository } from '../../domain/station.repository';
import { Station } from '../../domain/station';
import {
  AddStationUseCaseInputDto,
  AddStationUseCaseOutputDto,
} from './add-station.use-case.dto';
import { UniqueFieldException } from '../../../@shared/exception/unique-field.exception';

export class AddStationUseCase {
  constructor(private readonly stationRepository: StationRepository) {}

  public async execute(
    input: AddStationUseCaseInputDto,
  ): Promise<AddStationUseCaseOutputDto> {
    const station = new Station({
      name: input.name,
      line: input.line,
    });

    const alreadyExists = await this.stationRepository.verifyNameAlreadyExists({
      name: input.name,
    });

    if (alreadyExists) {
      throw new UniqueFieldException('name', 'Name already exists');
    }

    const { station: stationInserted } = await this.stationRepository.save({
      station,
    });

    return {
      id: stationInserted.id,
      name: stationInserted.name,
      line: stationInserted.line,
    };
  }
}
