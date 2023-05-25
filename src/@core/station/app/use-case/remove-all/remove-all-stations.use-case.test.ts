import { RemoveAllStationsUseCase } from './remove-all-stations.use-case';
import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { Station } from '../../../domain/station';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql/mysql-connection';
import { RepositoryVendor } from '../../../../@shared/utils/repository-vendor';
import { StationMongoRepository } from '../../../infra/repository/mongo/station.mongo.repository';
import { MongoHelper } from '../../../../@shared/infra/db/mongo/mongo-helper';

const makeSut = (vendor: RepositoryVendor = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
      : vendor === 'MONGO'
      ? new StationMongoRepository()
      : new StationInMemoryRepository();

  const removeAllUseCase = new RemoveAllStationsUseCase(repository);

  return {
    removeAllUseCase,
    repository,
  };
};

describe('RemoveAllStationsUseCase', () => {
  describe('In Memory', () => {
    it('should remove all stations', async () => {
      const { removeAllUseCase, repository } = makeSut();

      await repository.save({
        station: new Station({
          name: 'any_name1',
          line: 'any_line1',
        }),
      });

      await repository.save({
        station: new Station({
          name: 'any_name2',
          line: 'any_line2',
        }),
      });

      await removeAllUseCase.execute();

      const { stations } = await repository.findAll();

      expect(stations).toHaveLength(0);
    });
  });

  describe('MYSQL', () => {
    const connection = MySQLConnection.getInstance();

    const truncateTable = async () => {
      const database = process.env.DB_DATABASE_TEST;

      await connection.query(`TRUNCATE TABLE \`${database}\`.\`stations\``);
    };

    beforeEach(async () => {
      await truncateTable();
    });

    afterEach(async () => {
      await truncateTable();
    });

    it('should remove all stations', async () => {
      const { removeAllUseCase, repository } = makeSut('MYSQL');

      await repository.save({
        station: new Station({
          name: 'any_name1',
          line: 'any_line1',
        }),
      });

      await repository.save({
        station: new Station({
          name: 'any_name2',
          line: 'any_line2',
        }),
      });

      await removeAllUseCase.execute();

      const { stations } = await repository.findAll();

      expect(stations).toHaveLength(0);
    });
  });

  describe('MongoDB', () => {
    const truncateTables = async () => {
      const stationsCollection = await MongoHelper.getCollection('stations');

      await stationsCollection.deleteMany({});
    };

    beforeEach(async () => {
      await truncateTables();
    });

    afterEach(async () => {
      await truncateTables();
    });

    it('should remove all stations', async () => {
      const { removeAllUseCase, repository } = makeSut('MONGO');

      await repository.save({
        station: new Station({
          name: 'any_name1',
          line: 'any_line1',
        }),
      });

      await repository.save({
        station: new Station({
          name: 'any_name2',
          line: 'any_line2',
        }),
      });

      await removeAllUseCase.execute();

      const { stations } = await repository.findAll();

      expect(stations).toHaveLength(0);
    });
  });
});
