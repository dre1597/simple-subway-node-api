import { StationFacade } from '../facade/station.facade';
import { StationRepository } from '../domain/station.repository';
import { StationMysqlRepository } from '../infra/repository/mysql/station.mysql.repository';
import { StationInMemoryRepository } from '../infra/repository/in-memory/station.in-memory.repository';
import { AddStationUseCase } from '../use-case/add-station.use-case';

export class StationFacadeFactory {
  public static create(): StationFacade {
    const vendor = process.env.REPOSITORY_VENDOR;

    let repository: StationRepository;

    if (vendor === 'MYSQL') {
      repository = new StationMysqlRepository();
    } else {
      repository = new StationInMemoryRepository();
    }

    const addUseCase = new AddStationUseCase(repository);

    return new StationFacade(addUseCase);
  }
}
