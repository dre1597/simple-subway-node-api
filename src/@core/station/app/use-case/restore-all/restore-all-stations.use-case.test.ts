import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { Station } from '../../../domain/station';
import { RestoreAllStationsUseCase } from './restore-all-stations.use-case';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql/mysql-connection';
import { RepositoryVendor } from '../../../../@shared/types/repository-vendor';

const makeSut = (vendor: RepositoryVendor = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
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
