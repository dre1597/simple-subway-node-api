import { RepositoryVendor } from '#shared/app/utils/repository-vendor';
import { InvalidFieldException } from '#shared/domain/exception/invalid-field.exception';
import { UniqueFieldException } from '#shared/domain/exception/unique-field.exception';
import { setupMongoDB, setupMySQL } from '#shared/infra/testing/helpers/db';

import {
  MAX_STATION_LINE_LENGTH,
  MAX_STATION_NAME_LENGTH,
  MIN_STATION_LINE_LENGTH,
  MIN_STATION_NAME_LENGTH,
  Station,
} from '../../../domain/station';
import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { StationMongoRepository } from '../../../infra/repository/mongo/station.mongo.repository';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { AddStationUseCase } from './add-station.use-case';
import { AddStationUseCaseInputDto } from './add-station.use-case.dto';

const makeSut = (vendor: RepositoryVendor = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
      : vendor === 'MONGO'
      ? new StationMongoRepository()
      : new StationInMemoryRepository();

  const addUseCase = new AddStationUseCase(repository);

  return {
    repository,
    addUseCase,
  };
};

describe('AddStationUseCase', () => {
  describe('In Memory', () => {
    it('should add a station', async () => {
      const { addUseCase: useCase } = makeSut();

      const input: AddStationUseCaseInputDto = {
        name: 'any_name',
        line: 'any_line',
      };

      const output = await useCase.execute(input);

      expect(output).toEqual({
        id: 1,
        name: 'any_name',
        line: 'any_line',
      });
    });

    it('should activate a station when add a deleted station', async () => {
      const { addUseCase, repository } = makeSut();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore private field
      await repository.save({
        station: new Station({
          name: 'any_name',
          line: 'any_line',
          isDeleted: true,
        }),
      });

      let { stations } = await repository.findAll();

      expect(stations).toHaveLength(0);

      const input: AddStationUseCaseInputDto = {
        name: 'any_name',
        line: 'any_line',
      };

      await addUseCase.execute(input);

      stations = (await repository.findAll()).stations;

      expect(stations).toHaveLength(1);
      expect(stations[0].isDeleted).toBe(false);
    });

    it('should not add a station with a invalid name', async () => {
      const { addUseCase: useCase } = makeSut();

      const input: AddStationUseCaseInputDto = {
        name: '',
        line: 'any_line',
      };

      await expect(async () => {
        await useCase.execute(input);
      }).rejects.toThrow(
        new InvalidFieldException(
          'name',
          `Name must be between ${MIN_STATION_NAME_LENGTH} and ${MAX_STATION_NAME_LENGTH} characters long`,
        ),
      );
    });

    it('should not add a station with a invalid line', async () => {
      const { addUseCase: useCase } = makeSut();

      const input: AddStationUseCaseInputDto = {
        name: 'any_name',
        line: '',
      };

      await expect(async () => {
        await useCase.execute(input);
      }).rejects.toThrow(
        new InvalidFieldException(
          'line',
          `Line must be between ${MIN_STATION_LINE_LENGTH} and ${MAX_STATION_LINE_LENGTH} characters long`,
        ),
      );
    });

    it("should not add a station with the same name'", async () => {
      const { addUseCase: useCase } = makeSut();

      const input: AddStationUseCaseInputDto = {
        name: 'any_name',
        line: 'any_line',
      };

      await useCase.execute(input);

      await expect(async () => {
        await useCase.execute(input);
      }).rejects.toThrow(
        new UniqueFieldException('name', 'Name already exists'),
      );
    });
  });

  describe('MYSQL', () => {
    setupMySQL('stations');

    it('should add a station', async () => {
      const { addUseCase: useCase } = makeSut('MYSQL');

      const input: AddStationUseCaseInputDto = {
        name: 'any_name',
        line: 'any_line',
      };

      const output = await useCase.execute(input);

      expect(output).toEqual({
        id: 1,
        name: 'any_name',
        line: 'any_line',
      });
    });

    it('should activate a station when add a deleted station', async () => {
      const { addUseCase, repository } = makeSut('MYSQL');

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore private field
      await repository.save({
        station: new Station({
          name: 'any_name',
          line: 'any_line',
          isDeleted: true,
        }),
      });

      let { stations } = await repository.findAll();

      expect(stations).toHaveLength(0);

      const input: AddStationUseCaseInputDto = {
        name: 'any_name',
        line: 'any_line',
      };

      await addUseCase.execute(input);

      stations = (await repository.findAll()).stations;

      expect(stations).toHaveLength(1);
      expect(stations[0].isDeleted).toBe(false);
    });

    it('should not add a station with a invalid name', async () => {
      const { addUseCase: useCase } = makeSut('MYSQL');

      const input: AddStationUseCaseInputDto = {
        name: '',
        line: 'any_line',
      };

      await expect(async () => {
        await useCase.execute(input);
      }).rejects.toThrow(
        new InvalidFieldException(
          'name',
          `Name must be between ${MIN_STATION_NAME_LENGTH} and ${MAX_STATION_NAME_LENGTH} characters long`,
        ),
      );
    });

    it('should not add a station with a invalid line', async () => {
      const { addUseCase: useCase } = makeSut('MYSQL');

      const input: AddStationUseCaseInputDto = {
        name: 'any_name',
        line: '',
      };

      await expect(async () => {
        await useCase.execute(input);
      }).rejects.toThrow(
        new InvalidFieldException(
          'line',
          `Line must be between ${MIN_STATION_LINE_LENGTH} and ${MAX_STATION_LINE_LENGTH} characters long`,
        ),
      );
    });

    it('should not add a station with the same name', async () => {
      const { addUseCase: useCase } = makeSut('MYSQL');

      const input: AddStationUseCaseInputDto = {
        name: 'any_name',
        line: 'any_line',
      };

      await useCase.execute(input);

      await expect(async () => {
        await useCase.execute(input);
      }).rejects.toThrow(
        new UniqueFieldException('name', 'Name already exists'),
      );
    });
  });

  describe('MongoDB', () => {
    setupMongoDB('stations');

    it('should add a station', async () => {
      const { addUseCase: useCase } = makeSut('MONGO');

      const input: AddStationUseCaseInputDto = {
        name: 'any_name',
        line: 'any_line',
      };

      const output = await useCase.execute(input);

      expect(output).toEqual({
        id: 1,
        name: 'any_name',
        line: 'any_line',
      });
    });

    it('should activate a station when add a deleted station', async () => {
      const { addUseCase, repository } = makeSut('MONGO');

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore private field
      await repository.save({
        station: new Station({
          name: 'any_name',
          line: 'any_line',
          isDeleted: true,
        }),
      });

      let { stations } = await repository.findAll();

      expect(stations).toHaveLength(0);

      const input: AddStationUseCaseInputDto = {
        name: 'any_name',
        line: 'any_line',
      };

      await addUseCase.execute(input);

      stations = (await repository.findAll()).stations;

      expect(stations).toHaveLength(1);
      expect(stations[0].isDeleted).toBe(false);
    });

    it('should not add a station with a invalid name', async () => {
      const { addUseCase: useCase } = makeSut('MONGO');

      const input: AddStationUseCaseInputDto = {
        name: '',
        line: 'any_line',
      };

      await expect(async () => {
        await useCase.execute(input);
      }).rejects.toThrow(
        new InvalidFieldException(
          'name',
          `Name must be between ${MIN_STATION_NAME_LENGTH} and ${MAX_STATION_NAME_LENGTH} characters long`,
        ),
      );
    });

    it('should not add a station with a invalid line', async () => {
      const { addUseCase: useCase } = makeSut('MONGO');

      const input: AddStationUseCaseInputDto = {
        name: 'any_name',
        line: '',
      };

      await expect(async () => {
        await useCase.execute(input);
      }).rejects.toThrow(
        new InvalidFieldException(
          'line',
          `Line must be between ${MIN_STATION_LINE_LENGTH} and ${MAX_STATION_LINE_LENGTH} characters long`,
        ),
      );
    });

    it('should not add a station with the same name', async () => {
      const { addUseCase: useCase } = makeSut('MONGO');

      const input: AddStationUseCaseInputDto = {
        name: 'any_name',
        line: 'any_line',
      };

      await useCase.execute(input);

      await expect(async () => {
        await useCase.execute(input);
      }).rejects.toThrow(
        new UniqueFieldException('name', 'Name already exists'),
      );
    });
  });
});
