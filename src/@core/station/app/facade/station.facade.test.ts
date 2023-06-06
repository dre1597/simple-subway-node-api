import {
  setupMongoDB,
  setupMySQL,
} from '#core/@seedwork/infra/testing/helpers/db';
import { NotFoundException } from '#shared/exception/not-found.exception';
import { UniqueFieldException } from '#shared/exception/unique-field.exception';
import { RepositoryVendor } from '#shared/utils/repository-vendor';

import { StationInMemoryRepository } from '../../infra/repository/in-memory/station.in-memory.repository';
import { StationMongoRepository } from '../../infra/repository/mongo/station.mongo.repository';
import { StationMysqlRepository } from '../../infra/repository/mysql/station.mysql.repository';
import { AddStationUseCase } from '../use-case/add/add-station.use-case';
import { FindAllStationsUseCase } from '../use-case/find-all/find-all-stations.use-case';
import { FindStationByIdUseCase } from '../use-case/find-by-id/find-station-by-id.use-case';
import { RemoveAllStationsUseCase } from '../use-case/remove-all/remove-all-stations.use-case';
import { RemoveStationUseCase } from '../use-case/remove/remove-station.use-case';
import { RestoreAllStationsUseCase } from '../use-case/restore-all/restore-all-stations.use-case';
import { UpdateStationUseCase } from '../use-case/update/update-station.use-case';
import { StationFacade } from './station.facade';

const makeSut = (vendor: RepositoryVendor = 'IN_MEMORY'): StationFacade => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
      : vendor === 'MONGO'
      ? new StationMongoRepository()
      : new StationInMemoryRepository();

  const addUseCase = new AddStationUseCase(repository);
  const findAllUseCase = new FindAllStationsUseCase(repository);
  const findByIdUseCase = new FindStationByIdUseCase(repository);
  const updateUseCase = new UpdateStationUseCase(repository);
  const removeUseCase = new RemoveStationUseCase(repository);
  const removeAllUseCase = new RemoveAllStationsUseCase(repository);
  const restoreAllUseCase = new RestoreAllStationsUseCase(repository);

  return new StationFacade(
    addUseCase,
    findAllUseCase,
    findByIdUseCase,
    updateUseCase,
    removeUseCase,
    removeAllUseCase,
    restoreAllUseCase,
  );
};

describe('StationFacade', () => {
  describe('In Memory', () => {
    it('should add a station', async () => {
      const facade = makeSut();

      const input = {
        name: 'any_name',
        line: 'any_line',
      };

      await facade.add(input);
    });

    it('should throw UniqueFieldException when adding a station with the same name', async () => {
      const facade = makeSut();

      const input = {
        name: 'any_name',
        line: 'any_line',
      };

      await facade.add(input);

      await expect(async () => {
        await facade.add(input);
      }).rejects.toThrow(UniqueFieldException);
    });

    it('should find all stations', async () => {
      const facade = makeSut();

      await facade.findAll();
    });

    it('should find a station by id', async () => {
      const facade = makeSut();

      await facade.add({ name: 'any_name', line: 'any_line' });

      await facade.findById({ id: 1 });
    });

    it('should throw NotFoundException when not find a station by id', async () => {
      const facade = makeSut();

      await expect(async () => {
        await facade.findById({ id: 1 });
      }).rejects.toThrow(NotFoundException);
    });

    it('should update a station', async () => {
      const facade = makeSut();

      await facade.add({ name: 'any_name', line: 'any_line' });

      const input = {
        id: 1,
        name: 'any_name',
        line: 'any_line',
      };

      await facade.update(input);
    });

    it('should throw an error when not find a station', async () => {
      const facade = makeSut();

      await expect(async () => {
        await facade.update({ id: 1, name: 'any_name', line: 'any_line' });
      }).rejects.toThrow(NotFoundException);
    });

    it('should throw UniqueFieldException when updating a station with the same name', async () => {
      const facade = makeSut();

      await facade.add({
        name: 'unique_name',
        line: 'any_line1',
      });

      await facade.add({
        name: 'any_name2',
        line: 'any_line2',
      });

      const input = {
        id: 2,
        name: 'unique_name',
      };

      await expect(async () => {
        await facade.update(input);
      }).rejects.toThrow(UniqueFieldException);
    });

    it('should remove a station', async () => {
      const facade = makeSut();

      await facade.add({ name: 'any_name', line: 'any_line' });

      await facade.remove({ id: 1 });
    });

    it('should throw an error when not find a station', async () => {
      const facade = makeSut();

      await expect(async () => {
        await facade.remove({ id: 1 });
      }).rejects.toThrow(NotFoundException);
    });

    it('should remove all stations', async () => {
      const facade = makeSut();

      await facade.add({ name: 'any_name', line: 'any_line' });

      await facade.removeAll();
    });

    it('should restore all stations', async () => {
      const facade = makeSut();

      await facade.add({ name: 'any_name', line: 'any_line' });

      await facade.remove({
        id: 1,
      });

      await facade.restoreAll();
    });
  });

  describe('MYSQL', () => {
    setupMySQL('stations');

    it('should add a station', async () => {
      const facade = makeSut('MYSQL');

      const input = {
        name: 'any_name',
        line: 'any_line',
      };

      await facade.add(input);
    });

    it('should throw UniqueFieldException when adding a station with the same name', async () => {
      const facade = makeSut('MYSQL');

      const input = {
        name: 'any_name',
        line: 'any_line',
      };

      await facade.add(input);

      await expect(async () => {
        await facade.add(input);
      }).rejects.toThrow(UniqueFieldException);
    });

    it('should find all stations', async () => {
      const facade = makeSut('MYSQL');

      await facade.findAll();
    });

    it('should find a station by id', async () => {
      const facade = makeSut('MYSQL');

      await facade.add({ name: 'any_name', line: 'any_line' });

      await facade.findById({ id: 1 });
    });

    it('should throw an error when not find a station by id', async () => {
      const facade = makeSut('MYSQL');

      await expect(async () => {
        await facade.findById({ id: 1 });
      }).rejects.toThrow(NotFoundException);
    });

    it('should update a station', async () => {
      const facade = makeSut('MYSQL');

      await facade.add({ name: 'any_name', line: 'any_line' });

      const input = {
        id: 1,
        name: 'any_name',
        line: 'any_line',
      };

      await facade.update(input);
    });

    it('should throw an error when not find a station', async () => {
      const facade = makeSut('MYSQL');

      await expect(async () => {
        await facade.update({ id: 1, name: 'any_name', line: 'any_line' });
      }).rejects.toThrow(NotFoundException);
    });

    it('should throw UniqueFieldException when updating a station with the same name', async () => {
      const facade = makeSut('MYSQL');

      await facade.add({
        name: 'unique_name',
        line: 'any_line1',
      });

      await facade.add({
        name: 'any_name2',
        line: 'any_line2',
      });

      const input = {
        id: 2,
        name: 'unique_name',
      };

      await expect(async () => {
        await facade.update(input);
      }).rejects.toThrow(UniqueFieldException);
    });

    it('should remove a station', async () => {
      const facade = makeSut('MYSQL');

      await facade.add({ name: 'any_name', line: 'any_line' });

      await facade.remove({ id: 1 });
    });

    it('should throw an error when not find a station', async () => {
      const facade = makeSut('MYSQL');

      await expect(async () => {
        await facade.remove({ id: 1 });
      }).rejects.toThrow(NotFoundException);
    });

    it('should remove all stations', async () => {
      const facade = makeSut('MYSQL');

      await facade.add({ name: 'any_name', line: 'any_line' });

      await facade.removeAll();
    });

    it('should restore all stations', async () => {
      const facade = makeSut('MYSQL');

      await facade.add({ name: 'any_name', line: 'any_line' });

      await facade.remove({
        id: 1,
      });

      await facade.restoreAll();
    });
  });

  describe('MongoDB', () => {
    setupMongoDB('stations');

    it('should add a station', async () => {
      const facade = makeSut('MONGO');

      const input = {
        name: 'any_name',
        line: 'any_line',
      };

      await facade.add(input);
    });

    it('should throw UniqueFieldException when adding a station with the same name', async () => {
      const facade = makeSut('MONGO');

      const input = {
        name: 'any_name',
        line: 'any_line',
      };

      await facade.add(input);

      await expect(async () => {
        await facade.add(input);
      }).rejects.toThrow(UniqueFieldException);
    });

    it('should find all stations', async () => {
      const facade = makeSut('MONGO');

      await facade.findAll();
    });

    it('should find a station by id', async () => {
      const facade = makeSut('MONGO');

      await facade.add({ name: 'any_name', line: 'any_line' });

      await facade.findById({ id: 1 });
    });

    it('should throw an error when not find a station by id', async () => {
      const facade = makeSut('MONGO');

      await expect(async () => {
        await facade.findById({ id: 1 });
      }).rejects.toThrow(NotFoundException);
    });

    it('should update a station', async () => {
      const facade = makeSut('MONGO');

      await facade.add({ name: 'any_name', line: 'any_line' });

      const input = {
        id: 1,
        name: 'any_name',
        line: 'any_line',
      };

      await facade.update(input);
    });

    it('should throw an error when not find a station', async () => {
      const facade = makeSut('MONGO');

      await expect(async () => {
        await facade.update({ id: 1, name: 'any_name', line: 'any_line' });
      }).rejects.toThrow(NotFoundException);
    });

    it('should throw UniqueFieldException when updating a station with the same name', async () => {
      const facade = makeSut('MONGO');

      await facade.add({
        name: 'unique_name',
        line: 'any_line1',
      });

      await facade.add({
        name: 'any_name2',
        line: 'any_line2',
      });

      const input = {
        id: 2,
        name: 'unique_name',
      };

      await expect(async () => {
        await facade.update(input);
      }).rejects.toThrow(UniqueFieldException);
    });

    it('should remove a station', async () => {
      const facade = makeSut('MONGO');

      await facade.add({ name: 'any_name', line: 'any_line' });

      await facade.remove({ id: 1 });
    });

    it('should throw an error when not find a station', async () => {
      const facade = makeSut('MONGO');

      await expect(async () => {
        await facade.remove({ id: 1 });
      }).rejects.toThrow(NotFoundException);
    });

    it('should remove all stations', async () => {
      const facade = makeSut('MONGO');

      await facade.add({ name: 'any_name', line: 'any_line' });

      await facade.removeAll();
    });

    it('should restore all stations', async () => {
      const facade = makeSut('MONGO');

      await facade.add({ name: 'any_name', line: 'any_line' });

      await facade.remove({
        id: 1,
      });

      await facade.restoreAll();
    });
  });
});
