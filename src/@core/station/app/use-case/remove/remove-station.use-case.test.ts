import { NotFoundException } from '#shared/exception/not-found.exception';
import { MongoHelper } from '#shared/infra/db/mongo/mongo-helper';
import { MySQLConnection } from '#shared/infra/db/mysql/mysql-connection';
import { RepositoryVendor } from '#shared/utils/repository-vendor';

import { Station } from '../../../domain/station';
import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { StationMongoRepository } from '../../../infra/repository/mongo/station.mongo.repository';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { RemoveStationUseCase } from './remove-station.use-case';

const makeSut = (vendor: RepositoryVendor = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
      : vendor === 'MONGO'
      ? new StationMongoRepository()
      : new StationInMemoryRepository();

  const removeUseCase = new RemoveStationUseCase(repository);

  return {
    removeUseCase,
    repository,
  };
};

describe('RemoveStationUseCase', () => {
  describe('In Memory', () => {
    it('should remove a station', async () => {
      const { removeUseCase, repository } = makeSut();

      const { station: insertedStation } = await repository.save({
        station: new Station({
          name: 'any_name',
          line: 'any_line',
        }),
      });

      const { stations } = await repository.findAll();

      expect(stations).toHaveLength(1);
      expect(stations[0].id).toBe(insertedStation.id);
      expect(stations[0].name).toBe(insertedStation.name);
      expect(stations[0].line).toBe(insertedStation.line);

      await removeUseCase.execute({
        id: insertedStation.id,
      });

      const { stations: stationsAfterRemove } = await repository.findAll();

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

    it('should remove a station', async () => {
      const { removeUseCase, repository } = makeSut('MYSQL');

      const { station: insertedStation } = await repository.save({
        station: new Station({
          name: 'any_name',
          line: 'any_line',
        }),
      });

      const { stations } = await repository.findAll();

      expect(stations).toHaveLength(1);
      expect(stations[0].id).toBe(insertedStation.id);
      expect(stations[0].name).toBe(insertedStation.name);
      expect(stations[0].line).toBe(insertedStation.line);

      await removeUseCase.execute({
        id: insertedStation.id,
      });

      const { stations: stationsAfterRemove } = await repository.findAll();

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

    it('should remove a station', async () => {
      const { removeUseCase, repository } = makeSut('MONGO');

      const { station: insertedStation } = await repository.save({
        station: new Station({
          name: 'any_name',
          line: 'any_line',
        }),
      });

      const { stations } = await repository.findAll();

      expect(stations).toHaveLength(1);
      expect(stations[0].id).toBe(insertedStation.id);
      expect(stations[0].name).toBe(insertedStation.name);
      expect(stations[0].line).toBe(insertedStation.line);

      await removeUseCase.execute({
        id: insertedStation.id,
      });

      const { stations: stationsAfterRemove } = await repository.findAll();

      expect(stationsAfterRemove).toHaveLength(0);
    });

    it('should throw an error if the station does not exist', async () => {
      const { removeUseCase } = makeSut('MONGO');

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
