import { StationFacadeFactory } from './station.facade.factory';
import { StationFacade } from '../facade/station.facade';
import { StationMysqlRepository } from '../../infra/repository/mysql/station.mysql.repository';
import { StationInMemoryRepository } from '../../infra/repository/in-memory/station.in-memory.repository';
import { InvalidRepositoryVendorException } from '../../../@shared/exception/invalid-repository-vendor.exception';
import { StationMongoRepository } from '../../infra/repository/mongo/station.mongo.repository';

describe('StationFacade', () => {
  it('should create a station facade with in memory repository vendor', () => {
    const facade = StationFacadeFactory.create('IN_MEMORY');

    expect(facade).toBeInstanceOf(StationFacade);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._addUseCase.stationRepository).toBeInstanceOf(
      StationInMemoryRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._findAllUseCase.stationRepository).toBeInstanceOf(
      StationInMemoryRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._findByIdUseCase.stationRepository).toBeInstanceOf(
      StationInMemoryRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._updateUseCase.stationRepository).toBeInstanceOf(
      StationInMemoryRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._removeUseCase.stationRepository).toBeInstanceOf(
      StationInMemoryRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._removeAllUseCase.stationRepository).toBeInstanceOf(
      StationInMemoryRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._restoreAllUseCase.stationRepository).toBeInstanceOf(
      StationInMemoryRepository,
    );
  });

  it('should create a station facade with mysql repository vendor', () => {
    const facade = StationFacadeFactory.create('MYSQL');

    expect(facade).toBeInstanceOf(StationFacade);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._addUseCase.stationRepository).toBeInstanceOf(
      StationMysqlRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._findAllUseCase.stationRepository).toBeInstanceOf(
      StationMysqlRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._findByIdUseCase.stationRepository).toBeInstanceOf(
      StationMysqlRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._updateUseCase.stationRepository).toBeInstanceOf(
      StationMysqlRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._removeUseCase.stationRepository).toBeInstanceOf(
      StationMysqlRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._removeAllUseCase.stationRepository).toBeInstanceOf(
      StationMysqlRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._restoreAllUseCase.stationRepository).toBeInstanceOf(
      StationMysqlRepository,
    );
  });

  it('should create a station facade with mongodb repository vendor', () => {
    const facade = StationFacadeFactory.create('MONGO');

    expect(facade).toBeInstanceOf(StationFacade);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._addUseCase.stationRepository).toBeInstanceOf(
      StationMongoRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._findAllUseCase.stationRepository).toBeInstanceOf(
      StationMongoRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._findByIdUseCase.stationRepository).toBeInstanceOf(
      StationMongoRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._updateUseCase.stationRepository).toBeInstanceOf(
      StationMongoRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._removeUseCase.stationRepository).toBeInstanceOf(
      StationMongoRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._removeAllUseCase.stationRepository).toBeInstanceOf(
      StationMongoRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._restoreAllUseCase.stationRepository).toBeInstanceOf(
      StationMongoRepository,
    );
  });

  it('should throw an error when vendor is not supported', async () => {
    await expect(async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore invalid union type needed
      StationFacadeFactory.create('INVALID_VENDOR');
    }).rejects.toThrow(new InvalidRepositoryVendorException());
  });
});
