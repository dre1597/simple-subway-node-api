import { RepositoryVendor } from '#shared/app/utils/repository-vendor';
import { InvalidRepositoryVendorException } from '#shared/domain/exception/invalid-repository-vendor.exception';

import { StationRepository } from '../../domain/station.repository';
import { StationInMemoryRepository } from '../../infra/repository/in-memory/station.in-memory.repository';
import { StationMongoRepository } from '../../infra/repository/mongo/station.mongo.repository';
import { StationMysqlRepository } from '../../infra/repository/mysql/station.mysql.repository';
import { StationFacade } from '../facade/station.facade';
import { AddStationUseCase } from '../use-case/add/add-station.use-case';
import { FindAllStationsUseCase } from '../use-case/find-all/find-all-stations.use-case';
import { FindStationByIdUseCase } from '../use-case/find-by-id/find-station-by-id.use-case';
import { RemoveAllStationsUseCase } from '../use-case/remove-all/remove-all-stations.use-case';
import { RemoveStationUseCase } from '../use-case/remove/remove-station.use-case';
import { RestoreAllStationsUseCase } from '../use-case/restore-all/restore-all-stations.use-case';
import { UpdateStationUseCase } from '../use-case/update/update-station.use-case';

export class StationFacadeFactory {
  private static _repository: StationRepository;

  public static create(vendor: RepositoryVendor = 'IN_MEMORY'): StationFacade {
    console.info('Starting station module with vendor:', vendor);

    if (vendor === 'MYSQL') {
      this._repository = new StationMysqlRepository();
    } else if (vendor === 'IN_MEMORY') {
      this._repository = new StationInMemoryRepository();
    } else if (vendor === 'MONGO') {
      this._repository = new StationMongoRepository();
    } else {
      throw new InvalidRepositoryVendorException();
    }

    const addUseCase = new AddStationUseCase(this._repository);
    const findAllUseCase = new FindAllStationsUseCase(this._repository);
    const findByIdUseCase = new FindStationByIdUseCase(this._repository);
    const updateUseCase = new UpdateStationUseCase(this._repository);
    const removeUseCase = new RemoveStationUseCase(this._repository);
    const removeAllUseCase = new RemoveAllStationsUseCase(this._repository);
    const restoreAllUseCase = new RestoreAllStationsUseCase(this._repository);

    return new StationFacade(
      addUseCase,
      findAllUseCase,
      findByIdUseCase,
      updateUseCase,
      removeUseCase,
      removeAllUseCase,
      restoreAllUseCase,
    );
  }
}
