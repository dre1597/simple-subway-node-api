import {
  AddStationInputDto,
  FindAllStationsOutputDto,
  StationFacadeInterface,
} from './station.facade.interface';
import { AddStationUseCase } from '../use-case/add/add-station.use-case';
import { FindAllStationsUseCase } from '../use-case/find-all/find-all-stations.use-case';

export class StationFacade implements StationFacadeInterface {
  constructor(
    private readonly addUseCase: AddStationUseCase,
    private readonly findAllUseCase: FindAllStationsUseCase,
  ) {}

  async add(input: AddStationInputDto): Promise<void> {
    await this.addUseCase.execute({ name: input.name, line: input.line });
  }

  public findAll(): Promise<FindAllStationsOutputDto> {
    return this.findAllUseCase.execute();
  }
}
