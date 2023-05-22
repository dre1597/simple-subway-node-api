import { StationRepository } from '../../../domain/station.repository';
import {
  UpdateStationUseCaseInputDto,
  UpdateStationUseCaseOutputDto,
} from './update-station.use-case.dto';
import { UniqueFieldException } from '../../../../@shared/exception/unique-field.exception';
import { UseCaseInterface } from '../../../../@seedwork/use-case.interface';

export class UpdateStationUseCase implements UseCaseInterface {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(
    input: UpdateStationUseCaseInputDto,
  ): Promise<UpdateStationUseCaseOutputDto> {
    const { station } = await this.stationRepository.findById({ id: input.id });

    station.update({
      name: input.name,
      line: input.line,
    });

    const { station: stationFound, alreadyExists } =
      await this.stationRepository.verifyNameAlreadyExists({
        name: input.name,
        id: input.id,
      });

    if (alreadyExists) {
      if (!stationFound.isDeleted) {
        throw new UniqueFieldException('name', 'Name already exists');
      }

      await this.stationRepository.delete({
        id: stationFound.id,
      });
    }

    const { station: updatedStation } = await this.stationRepository.save({
      station,
    });

    return {
      id: updatedStation.id,
      name: updatedStation.name,
      line: updatedStation.line,
    };
  }
}
