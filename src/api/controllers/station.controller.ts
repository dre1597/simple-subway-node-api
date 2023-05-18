import {
  FindAllStationsOutputDto,
  StationFacadeInterface,
} from '../../@core/station/app/facade/station.facade.interface';
import { AddStationValidator } from '../validators/add-station.validator';

export class StationController {
  constructor(private readonly facade: StationFacadeInterface) {}

  public async add(name: string, line: string): Promise<void> {
    await AddStationValidator.validate(name, line);

    return await this.facade.add({ name, line });
  }

  public async findAll(): Promise<FindAllStationsOutputDto> {
    return await this.facade.findAll();
  }
}
