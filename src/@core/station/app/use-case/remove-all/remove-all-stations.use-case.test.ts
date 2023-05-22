import { RemoveAllStationsUseCase } from './remove-all-stations.use-case';
import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { Station } from '../../../domain/station';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';

const makeSut = (vendor: 'IN_MEMORY' | 'MYSQL' = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
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
    const database = process.env.DB_DATABASE_TEST;

    const truncateTable = async () => {
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
});
