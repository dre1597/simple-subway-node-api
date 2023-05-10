import { StationFacade } from '../facade/station.facade';
import { StationRepository } from '../domain/station.repository';
import { StationMysqlRepository } from '../infra/repository/mysql/station.mysql.repository';
import { StationInMemoryRepository } from '../infra/repository/in-memory/station.in-memory.repository';
import { AddStationUseCase } from '../use-case/add-station.use-case';
import { InvalidRepositoryVendorException } from '../../@shared/exception/infra/invalid-repository-vendor.exception';

export class StationFacadeFactory {
  private static _repository: StationRepository;

  public static create(
    vendor: 'MYSQL' | 'IN_MEMORY' = 'IN_MEMORY',
  ): StationFacade {
    if (vendor === 'MYSQL') {
      this._repository = new StationMysqlRepository();
    } else if (vendor === 'IN_MEMORY') {
      this._repository = new StationInMemoryRepository();
    } else {
      throw new InvalidRepositoryVendorException();
    }

    const addUseCase = new AddStationUseCase(this._repository);

    return new StationFacade(addUseCase);
  }
}
