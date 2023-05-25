import { AddStationUseCase } from '../use-case/add/add-station.use-case';
import { FindAllStationsUseCase } from '../use-case/find-all/find-all-stations.use-case';
import { FindStationByIdUseCase } from '../use-case/find-by-id/find-station-by-id.use-case';
import { RemoveAllStationsUseCase } from '../use-case/remove-all/remove-all-stations.use-case';
import { RemoveStationUseCase } from '../use-case/remove/remove-station.use-case';
import { RestoreAllStationsUseCase } from '../use-case/restore-all/restore-all-stations.use-case';
import { UpdateStationUseCase } from '../use-case/update/update-station.use-case';
import {
  AddStationInputDto,
  FindAllStationsOutputDto,
  FindStationByIdInputDto,
  FindStationByIdOutputDto,
  RemoveStationInputDto,
  StationFacadeInterface,
  UpdateStationInputDto,
} from './station.facade.interface';

export class StationFacade implements StationFacadeInterface {
  constructor(
    private readonly _addUseCase: AddStationUseCase,
    private readonly _findAllUseCase: FindAllStationsUseCase,
    private readonly _findByIdUseCase: FindStationByIdUseCase,
    private readonly _updateUseCase: UpdateStationUseCase,
    private readonly _removeUseCase: RemoveStationUseCase,
    private readonly _removeAllUseCase: RemoveAllStationsUseCase,
    private readonly _restoreAllUseCase: RestoreAllStationsUseCase,
  ) {}

  public async add(input: AddStationInputDto): Promise<void> {
    await this._addUseCase.execute({ name: input.name, line: input.line });
  }

  public async findAll(): Promise<FindAllStationsOutputDto> {
    return this._findAllUseCase.execute();
  }

  public async findById(
    input: FindStationByIdInputDto,
  ): Promise<FindStationByIdOutputDto> {
    return this._findByIdUseCase.execute({ id: input.id });
  }

  public async update(input: UpdateStationInputDto): Promise<void> {
    await this._updateUseCase.execute({
      id: input.id,
      name: input.name,
      line: input.line,
    });
  }

  public async remove(input: RemoveStationInputDto): Promise<void> {
    await this._removeUseCase.execute({ id: input.id });
  }

  public async removeAll(): Promise<void> {
    await this._removeAllUseCase.execute();
  }

  public restoreAll(): Promise<void> {
    return this._restoreAllUseCase.execute();
  }
}
