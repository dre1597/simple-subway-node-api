import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { AddStationUseCase } from '../add/add-station.use-case';
import { RemoveStationUseCase } from './remove-station.use-case';
import { FindAllStationsUseCase } from '../find-all/find-all-stations.use-case';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';

const makeSut = (vendor: 'IN_MEMORY' | 'MYSQL' = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
      : new StationInMemoryRepository();

  const addUseCase = new AddStationUseCase(repository);
  const findAllUseCase = new FindAllStationsUseCase(repository);
  const removeUseCase = new RemoveStationUseCase(repository);

  return {
    addUseCase,
    findAllUseCase,
    removeUseCase,
  };
};

describe('RemoveStationUseCase', () => {
  describe('In Memory', () => {
    it('should remove a station', async () => {
      const { addUseCase, findAllUseCase, removeUseCase } = makeSut();

      const { id: insertedId } = await addUseCase.execute({
        name: 'any_name',
        line: 'any_line',
      });

      const { stations } = await findAllUseCase.execute();

      expect(stations).toHaveLength(1);
      expect(stations[0].id).toBe(insertedId);

      await removeUseCase.execute({
        id: insertedId,
      });

      const { stations: stationsAfterRemove } = await findAllUseCase.execute();

      expect(stationsAfterRemove).toHaveLength(0);
    });

    it('should throw an error if the station does not exist', async () => {
      const { removeUseCase } = makeSut();

      const input = { id: 1 };

      await expect(removeUseCase.execute(input)).rejects.toThrowError(
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

    it('should remove a station', async () => {
      const { addUseCase, findAllUseCase, removeUseCase } = makeSut('MYSQL');

      const { id: insertedId } = await addUseCase.execute({
        name: 'any_name',
        line: 'any_line',
      });

      const { stations } = await findAllUseCase.execute();

      expect(stations).toHaveLength(1);
      expect(stations[0].id).toBe(insertedId);

      await removeUseCase.execute({
        id: insertedId,
      });

      const { stations: stationsAfterRemove } = await findAllUseCase.execute();

      expect(stationsAfterRemove).toHaveLength(0);
    });

    it('should throw an error if the station does not exist', async () => {
      const { removeUseCase } = makeSut('MYSQL');

      const input = { id: 1 };

      await expect(removeUseCase.execute(input)).rejects.toThrowError(
        new NotFoundException(
          'Station',
          `Station with id ${input.id} not found`,
        ),
      );
    });
  });
});
