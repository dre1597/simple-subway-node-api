import {
  AddStationInputDto,
  FindAllStationsOutputDto,
  FindStationByIdInputDto,
  FindStationByIdOutputDto,
  StationFacadeInterface,
} from './station.facade.interface';
import { AddStationUseCase } from '../use-case/add/add-station.use-case';
import { FindAllStationsUseCase } from '../use-case/find-all/find-all-stations.use-case';
import { FindStationByIdUseCase } from '../use-case/find-by-id/find-station-by-id.use-case';
import { UpdateStationUseCaseInputDto } from '../use-case/update/update-station.use-case.dto';
import { UpdateStationUseCase } from '../use-case/update/update-station.use-case';

export class StationFacade implements StationFacadeInterface {
  constructor(
    private readonly addUseCase: AddStationUseCase,
    private readonly findAllUseCase: FindAllStationsUseCase,
    private readonly findByIdUseCase: FindStationByIdUseCase,
    private readonly updateUseCase: UpdateStationUseCase,
  ) {}

  public async add(input: AddStationInputDto): Promise<void> {
    await this.addUseCase.execute({ name: input.name, line: input.line });
  }

  public async findAll(): Promise<FindAllStationsOutputDto> {
    return this.findAllUseCase.execute();
  }

  public async findById(
    input: FindStationByIdInputDto,
  ): Promise<FindStationByIdOutputDto> {
    return this.findByIdUseCase.execute({ id: input.id });
  }

  public async update(input: UpdateStationUseCaseInputDto): Promise<void> {
    await this.updateUseCase.execute({
      id: input.id,
      name: input.name,
      line: input.line,
    });
  }
}
