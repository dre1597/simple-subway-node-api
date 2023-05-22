import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { AddStationUseCase } from '../add/add-station.use-case';
import { FindStationByIdUseCase } from './find-station-by-id.use-case';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';

const makeSut = (vendor: 'IN_MEMORY' | 'MYSQL' = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
      : new StationInMemoryRepository();

  const addUseCase = new AddStationUseCase(repository);
  const findByIdUseCase = new FindStationByIdUseCase(repository);

  return {
    addUseCase,
    findByIdUseCase,
  };
};

describe('FindAllStationsUseCase', () => {
  describe('In Memory', () => {
    it('should find all stations', async () => {
      const { addUseCase, findByIdUseCase } = makeSut();

      await addUseCase.execute({
        name: 'any_name1',
        line: 'any_line1',
      });

      const output = await findByIdUseCase.execute({
        id: 1,
      });

      expect(output).toEqual({
        station: {
          id: 1,
          name: 'any_name1',
          line: 'any_line1',
        },
      });
    });

    it('should throw an error if station not found', async () => {
      const { findByIdUseCase } = makeSut();

      const input = { id: 1 };

      await expect(async () => {
        await findByIdUseCase.execute(input);
      }).rejects.toThrowError(
        new NotFoundException(
          'Station',
          `Station with id ${input.id} not found`,
        ),
      );
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
      const { addUseCase, findByIdUseCase } = makeSut('MYSQL');

      await addUseCase.execute({
        name: 'any_name1',
        line: 'any_line1',
      });

      const output = await findByIdUseCase.execute({
        id: 1,
      });

      expect(output).toEqual({
        station: {
          id: 1,
          name: 'any_name1',
          line: 'any_line1',
        },
      });
    });

    it('should throw an error if station not found', async () => {
      const { findByIdUseCase } = makeSut('MYSQL');

      const input = { id: 1 };

      await expect(async () => {
        await findByIdUseCase.execute(input);
      }).rejects.toThrowError(
        new NotFoundException(
          'Station',
          `Station with id ${input.id} not found`,
        ),
      );
    });
  });
});
