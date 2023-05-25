import { UseCaseInterface } from '../../../../@seedwork/use-case.interface';
import { UniqueFieldException } from '../../../../@shared/exception/unique-field.exception';
import { Station } from '../../../domain/station';
import { StationRepository } from '../../../domain/station.repository';
import {
  AddStationUseCaseInputDto,
  AddStationUseCaseOutputDto,
} from './add-station.use-case.dto';

export class AddStationUseCase implements UseCaseInterface {
  constructor(private readonly stationRepository: StationRepository) {}

  public async execute(
    input: AddStationUseCaseInputDto,
  ): Promise<AddStationUseCaseOutputDto> {
    let station = new Station({
      name: input.name,
      line: input.line,
    });

    const { station: stationFound, alreadyExists } =
      await this.stationRepository.verifyNameAlreadyExists({
        name: input.name,
      });

    if (alreadyExists) {
      if (!stationFound.isDeleted) {
        throw new UniqueFieldException('name', 'Name already exists');
      }

      stationFound.id = stationFound.id;
      stationFound.restore();
      stationFound.update({
        line: input.line,
      });

      station = stationFound;
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
