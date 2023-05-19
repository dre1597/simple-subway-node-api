import {
  FindAllStationsOutputDto,
  FindStationByIdOutputDto,
  StationFacadeInterface,
} from '../../@core/station/app/facade/station.facade.interface';
import { AddStationValidator } from '../validators/add-station.validator';
import { UpdateStationValidator } from '../validators/update-station.validator';

export class StationController {
  constructor(private readonly facade: StationFacadeInterface) {}

  public async add(name: string, line: string): Promise<void> {
    await AddStationValidator.validate(name, line);

    return await this.facade.add({ name, line });
  }

  public async findAll(): Promise<FindAllStationsOutputDto> {
    return await this.facade.findAll();
  }

  public async findById(id: number): Promise<FindStationByIdOutputDto> {
    return await this.facade.findById({ id });
  }

  public async update(id: number, name?: string, line?: string): Promise<void> {
    await UpdateStationValidator.validate(name, line);

    return await this.facade.update({ id, name, line });
  }

  public async remove(id: number): Promise<void> {
    return await this.facade.remove({ id });
  }

  public async removeAll(): Promise<void> {
    return await this.facade.removeAll();
  }

  public async restoreAll(): Promise<void> {
    return await this.facade.restoreAll();
  }
}
