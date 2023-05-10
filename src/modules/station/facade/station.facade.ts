import {
  AddStationInputDto,
  StationFacadeInterface,
} from './station.facade.interface';
import { AddStationUseCase } from '../use-case/add-station.use-case';

export class StationFacade implements StationFacadeInterface {
  constructor(private readonly addUseCase: AddStationUseCase) {}

  async add(input: AddStationInputDto): Promise<void> {
    await this.addUseCase.execute({ name: input.name, line: input.line });
  }
}
