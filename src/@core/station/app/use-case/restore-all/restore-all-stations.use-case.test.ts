import {
  setupMongoDB,
  setupMySQL,
} from '#core/@seedwork/infra/testing/helpers/db';
import { RepositoryVendor } from '#shared/utils/repository-vendor';

import { Station } from '../../../domain/station';
import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { StationMongoRepository } from '../../../infra/repository/mongo/station.mongo.repository';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { RestoreAllStationsUseCase } from './restore-all-stations.use-case';

const makeSut = (vendor: RepositoryVendor = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
      : vendor === 'MONGO'
      ? new StationMongoRepository()
      : new StationInMemoryRepository();

  const restoreAllUseCase = new RestoreAllStationsUseCase(repository);

  return {
    restoreAllUseCase,
    repository,
  };
};

describe('RestoreAllStationsUseCase', () => {
  describe('In Memory', () => {
    it('should restore all stations', async () => {
      const { restoreAllUseCase, repository } = makeSut();

      await repository.save({
        station: new Station({
          name: 'any_name1',
          line: 'any_line1',
          isDeleted: true,
        }),
      });

      await repository.save({
        station: new Station({
          name: 'any_name2',
          line: 'any_line2',
          isDeleted: true,
        }),
      });

      await restoreAllUseCase.execute();

      const { stations } = await repository.findAll();

      expect(stations).toHaveLength(2);
    });
  });

  describe('MYSQL', () => {
    setupMySQL('stations');

    it('should restore all stations', async () => {
      const { restoreAllUseCase, repository } = makeSut('MYSQL');

      await repository.save({
        station: new Station({
          name: 'any_name1',
          line: 'any_line1',
          isDeleted: true,
        }),
      });

      await repository.save({
        station: new Station({
          name: 'any_name2',
          line: 'any_line2',
          isDeleted: true,
        }),
      });

      await restoreAllUseCase.execute();

      const { stations } = await repository.findAll();

      expect(stations).toHaveLength(2);
    });
  });

  describe('MongoDB', () => {
    setupMongoDB('stations');

    it('should restore all stations', async () => {
      const { restoreAllUseCase, repository } = makeSut('MYSQL');

      await repository.save({
        station: new Station({
          name: 'any_name1',
          line: 'any_line1',
          isDeleted: true,
        }),
      });

      await repository.save({
        station: new Station({
          name: 'any_name2',
          line: 'any_line2',
          isDeleted: true,
        }),
      });

      await restoreAllUseCase.execute();

      const { stations } = await repository.findAll();

      expect(stations).toHaveLength(2);
    });
  });
});
