import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { Station } from '../../../domain/station';
import { RestoreAllStationUseCase } from './restore-all-station.use-case';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';

const makeSut = (vendor: 'IN_MEMORY' | 'MYSQL' = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
      : new StationInMemoryRepository();

  const restoreAllUseCase = new RestoreAllStationUseCase(repository);

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
