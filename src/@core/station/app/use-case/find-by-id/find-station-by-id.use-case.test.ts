import { setupMySQL } from '#core/@seedwork/infra/testing/helpers/db';
import { NotFoundException } from '#shared/exception/not-found.exception';
import { MongoHelper } from '#shared/infra/db/mongo/mongo-helper';
import { RepositoryVendor } from '#shared/utils/repository-vendor';

import { Station } from '../../../domain/station';
import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { StationMongoRepository } from '../../../infra/repository/mongo/station.mongo.repository';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { FindStationByIdUseCase } from './find-station-by-id.use-case';

const makeSut = (vendor: RepositoryVendor = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
      : vendor === 'MONGO'
      ? new StationMongoRepository()
      : new StationInMemoryRepository();

  const findByIdUseCase = new FindStationByIdUseCase(repository);

  return {
    findByIdUseCase,
    repository,
  };
};

describe('FindStationByIdUseCase', () => {
  describe('In Memory', () => {
    it('should find a station by id', async () => {
      const { findByIdUseCase, repository } = makeSut();

      await repository.save({
        station: new Station({
          name: 'any_name',
          line: 'any_line',
        }),
      });

      const output = await findByIdUseCase.execute({
        id: 1,
      });

      expect(output).toEqual({
        station: {
          id: 1,
          name: 'any_name',
          line: 'any_line',
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
    setupMySQL('stations');

    it('should find all stations', async () => {
      const { findByIdUseCase, repository } = makeSut('MYSQL');

      await repository.save({
        station: new Station({
          name: 'any_name',
          line: 'any_line',
        }),
      });

      const output = await findByIdUseCase.execute({
        id: 1,
      });

      expect(output).toEqual({
        station: {
          id: 1,
          name: 'any_name',
          line: 'any_line',
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
      const { findByIdUseCase, repository } = makeSut('MONGO');

      await repository.save({
        station: new Station({
          name: 'any_name',
          line: 'any_line',
        }),
      });

      const output = await findByIdUseCase.execute({
        id: 1,
      });

      expect(output).toEqual({
        station: {
          id: 1,
          name: 'any_name',
          line: 'any_line',
        },
      });
    });

    it('should throw an error if station not found', async () => {
      const { findByIdUseCase } = makeSut('MONGO');

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
