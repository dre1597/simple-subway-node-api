import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { FindAllStationsUseCase } from './find-all-stations.use-case';
import { AddStationUseCase } from '../add/add-station.use-case';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';

const makeSut = (vendor: 'IN_MEMORY' | 'MYSQL' = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
      : new StationInMemoryRepository();

  const addUseCase = new AddStationUseCase(repository);
  const findAllUseCase = new FindAllStationsUseCase(repository);

  return {
    addUseCase,
    findAllUseCase,
  };
};

describe('FindAllStationsUseCase', () => {
  describe('In Memory', () => {
    it('should find all stations', async () => {
      const { addUseCase, findAllUseCase } = makeSut();

      await addUseCase.execute({
        name: 'any_name1',
        line: 'any_line1',
      });

      await addUseCase.execute({
        name: 'any_name2',
        line: 'any_line2',
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

    it('should find all stations', async () => {
      const { addUseCase, findAllUseCase } = makeSut('MYSQL');

      await addUseCase.execute({
        name: 'any_name1',
        line: 'any_line1',
      });

      await addUseCase.execute({
        name: 'any_name2',
        line: 'any_line2',
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
});
