import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { FindAllStationsUseCase } from './find-all-stations.use-case';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql/mysql-connection';
import { Station } from '../../../domain/station';
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

  const findAllUseCase = new FindAllStationsUseCase(repository);

  return {
    findAllUseCase,
    repository,
  };
};

describe('FindAllStationsUseCase', () => {
  describe('In Memory', () => {
    it('should find all stations', async () => {
      const { findAllUseCase, repository } = makeSut();

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

      const output = await findAllUseCase.execute();

      expect(output).toEqual({
        stations: [
          {
            id: 1,
            name: 'any_name1',
            line: 'any_line1',
          },
          {
            id: 2,
            name: 'any_name2',
            line: 'any_line2',
          },
        ],
      });
    });

    it('should return an empty array if there is not stations', async () => {
      const { findAllUseCase: useCase } = makeSut();

      const output = await useCase.execute();

      expect(output.stations).toEqual([]);
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

    it('should find all stations', async () => {
      const { findAllUseCase, repository } = makeSut('MYSQL');

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
      const output = await findAllUseCase.execute();

      expect(output).toEqual({
        stations: [
          {
            id: 1,
            name: 'any_name1',
            line: 'any_line1',
          },
          {
            id: 2,
            name: 'any_name2',
            line: 'any_line2',
          },
        ],
      });
    });

    it('should return an empty array if there is not stations', async () => {
      const { findAllUseCase: useCase } = makeSut('MYSQL');

      const output = await useCase.execute();

      expect(output.stations).toEqual([]);
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

    it('should find all stations', async () => {
      const { findAllUseCase, repository } = makeSut('MONGO');

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
      const output = await findAllUseCase.execute();

      expect(output).toEqual({
        stations: [
          {
            id: 1,
            name: 'any_name1',
            line: 'any_line1',
          },
          {
            id: 2,
            name: 'any_name2',
            line: 'any_line2',
          },
        ],
      });
    });

    it('should return an empty array if there is not stations', async () => {
      const { findAllUseCase: useCase } = makeSut('MONGO');

      const output = await useCase.execute();

      expect(output.stations).toEqual([]);
    });
  });
});
