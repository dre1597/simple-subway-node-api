import { StationFacade } from '../facade/station.facade';
import { StationRepository } from '../domain/station.repository';
import { StationMysqlRepository } from '../infra/repository/mysql/station.mysql.repository';
import { StationInMemoryRepository } from '../infra/repository/in-memory/station.in-memory.repository';
import { AddStationUseCase } from '../use-case/add/add-station.use-case';
import { InvalidRepositoryVendorException } from '../../@shared/exception/infra/invalid-repository-vendor.exception';
import { FindAllStationsUseCase } from '../use-case/find-all/find-all-stations.use-case';

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
    const findAllUseCase = new FindAllStationsUseCase(this._repository);

    return new StationFacade(addUseCase, findAllUseCase);
  }
}