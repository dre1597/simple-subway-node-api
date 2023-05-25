import { AddStationUseCase } from '../add/add-station.use-case';
import { UpdateStationUseCase } from './update-station.use-case';
import { UpdateStationUseCaseInputDto } from './update-station.use-case.dto';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';
import { UniqueFieldException } from '../../../../@shared/exception/unique-field.exception';
import { Station } from '../../../domain/station';
import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { StationMysqlRepository } from '../../../infra/repository/mysql/station.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql/mysql-connection';
import { RepositoryVendor } from '../../../../@shared/types/repository-vendor';

const makeSut = (vendor: RepositoryVendor = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new StationMysqlRepository()
      : new StationInMemoryRepository();

  const addUseCase = new AddStationUseCase(repository);
  const updateUseCase = new UpdateStationUseCase(repository);

  return {
    repository,
    addUseCase,
    updateUseCase,
  };
};

describe('UpdateStationUseCase', () => {
  describe('In Memory', () => {
    it('should update a station', async () => {
      const { addUseCase, updateUseCase } = makeSut();

      const { id: insertedId } = await addUseCase.execute({
        name: 'any_name',
        line: 'any_line',
      });

      const input: UpdateStationUseCaseInputDto = {
        id: insertedId,
        name: 'updated_name',
        line: 'updated_line',
      };

      const output = await updateUseCase.execute(input);

      expect(output.id).toBe(input.id);
      expect(output.name).toBe(input.name);
      expect(output.line).toBe(input.line);
    });

    it('should keep the name if its not present', async () => {
      const { addUseCase, updateUseCase } = makeSut();

      const addInput = {
        name: 'any_name',
        line: 'any_line',
      };

      const { id: insertedId } = await addUseCase.execute(addInput);

      const updateInput: UpdateStationUseCaseInputDto = {
        id: insertedId,
        line: 'updated_line',
      };

      const output = await updateUseCase.execute(updateInput);

      expect(output.id).toBe(updateInput.id);
      expect(output.name).toBe(addInput.name);
      expect(output.line).toBe(updateInput.line);
    });

    it('should keep the line if its not present', async () => {
      const { addUseCase, updateUseCase } = makeSut();

      const addInput = {
        name: 'any_name',
        line: 'any_line',
      };

      const { id: insertedId } = await addUseCase.execute(addInput);

      const updateInput: UpdateStationUseCaseInputDto = {
        id: insertedId,
        name: 'updated_name',
      };

      const output = await updateUseCase.execute(updateInput);

      expect(output.id).toBe(updateInput.id);
      expect(output.name).toBe(updateInput.name);
      expect(output.line).toBe(addInput.line);
    });

    it('should throws NotFoundException if there is no station', async () => {
      const { updateUseCase } = makeSut();

      const input: UpdateStationUseCaseInputDto = {
        id: 1,
        name: 'updated_name',
        line: 'updated_line',
      };

      await expect(async () => {
        await updateUseCase.execute(input);
      }).rejects.toThrow(
        new NotFoundException(
          'Station',
          `Station with id ${input.id} not found`,
        ),
      );
    });

    it('should throws UniqueFieldException if there is a station with the same name', async () => {
      const { addUseCase, updateUseCase } = makeSut();

      await addUseCase.execute({
        name: 'unique_name',
        line: 'any_line2',
      });

      const { id: insertedId } = await addUseCase.execute({
        name: 'any_name2',
        line: 'any_line2',
      });

      const input: UpdateStationUseCaseInputDto = {
        id: insertedId,
        name: 'unique_name',
        line: 'updated_line',
      };

      await expect(async () => {
        await updateUseCase.execute(input);
      }).rejects.toThrow(
        new UniqueFieldException('name', 'Name already exists'),
      );
    });

    it('should delete permanently a station if another one is updated to a deleted one', async () => {
      const { updateUseCase, repository } = makeSut();

      let { stations } = await repository.findAll();

      expect(stations).toHaveLength(0);

      await repository.save({
        station: new Station({
          name: 'unique_name',
          line: 'any_line1',
          isDeleted: true,
        }),
      });

      stations = (await repository.findAll()).stations;

      expect(stations).toHaveLength(0);

      const { station: stationToUpdated } = await repository.save({
        station: new Station({
          name: 'any_name2',
          line: 'any_line2',
        }),
      });

      stations = (await repository.findAll()).stations;
      expect(stations).toHaveLength(1);

      await updateUseCase.execute({
        id: stationToUpdated.id,
        name: 'unique_name',
      });

      stations = (await repository.findAll()).stations;

      expect(stations).toHaveLength(1);
      expect(stations[0].name).toBe('unique_name');
      expect(stations[0].line).toBe('any_line2');
    });
  });

  describe('MySQL', () => {
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

    it('should update a station', async () => {
      const { addUseCase, updateUseCase } = makeSut('MYSQL');

      const { id: insertedId } = await addUseCase.execute({
        name: 'any_name',
        line: 'any_line',
      });

      const input: UpdateStationUseCaseInputDto = {
        id: insertedId,
        name: 'updated_name',
        line: 'updated_line',
      };

      const output = await updateUseCase.execute(input);

      expect(output.id).toBe(input.id);
      expect(output.name).toBe(input.name);
      expect(output.line).toBe(input.line);
    });

    it('should keep the name if its not present', async () => {
      const { addUseCase, updateUseCase } = makeSut('MYSQL');

      const addInput = {
        name: 'any_name',
        line: 'any_line',
      };

      const { id: insertedId } = await addUseCase.execute(addInput);

      const updateInput: UpdateStationUseCaseInputDto = {
        id: insertedId,
        line: 'updated_line',
      };

      const output = await updateUseCase.execute(updateInput);

      expect(output.id).toBe(updateInput.id);
      expect(output.name).toBe(addInput.name);
      expect(output.line).toBe(updateInput.line);
    });

    it('should keep the line if its not present', async () => {
      const { addUseCase, updateUseCase } = makeSut('MYSQL');

      const addInput = {
        name: 'any_name',
        line: 'any_line',
      };

      const { id: insertedId } = await addUseCase.execute(addInput);

      const updateInput: UpdateStationUseCaseInputDto = {
        id: insertedId,
        name: 'updated_name',
      };

      const output = await updateUseCase.execute(updateInput);

      expect(output.id).toBe(updateInput.id);
      expect(output.name).toBe(updateInput.name);
      expect(output.line).toBe(addInput.line);
    });

    it('should throws NotFoundException if there is no station', async () => {
      const { updateUseCase } = makeSut('MYSQL');

      const input: UpdateStationUseCaseInputDto = {
        id: 1,
        name: 'updated_name',
        line: 'updated_line',
      };

      await expect(async () => {
        await updateUseCase.execute(input);
      }).rejects.toThrow(
        new NotFoundException(
          'Station',
          `Station with id ${input.id} not found`,
        ),
      );
    });

    it('should throws UniqueFieldException if there is a station with the same name', async () => {
      const { addUseCase, updateUseCase } = makeSut('MYSQL');

      await addUseCase.execute({
        name: 'unique_name',
        line: 'any_line2',
      });

      const { id: insertedId } = await addUseCase.execute({
        name: 'any_name2',
        line: 'any_line2',
      });

      const input: UpdateStationUseCaseInputDto = {
        id: insertedId,
        name: 'unique_name',
        line: 'updated_line',
      };

      await expect(async () => {
        await updateUseCase.execute(input);
      }).rejects.toThrow(
        new UniqueFieldException('name', 'Name already exists'),
      );
    });

    it('should delete permanently a station if another one is updated to a deleted one', async () => {
      const { updateUseCase, repository } = makeSut('MYSQL');

      let { stations } = await repository.findAll();

      expect(stations).toHaveLength(0);

      await repository.save({
        station: new Station({
          name: 'unique_name',
          line: 'any_line1',
          isDeleted: true,
        }),
      });

      stations = (await repository.findAll()).stations;

      expect(stations).toHaveLength(0);

      const { station: stationToUpdated } = await repository.save({
        station: new Station({
          name: 'any_name2',
          line: 'any_line2',
        }),
      });

      stations = (await repository.findAll()).stations;
      expect(stations).toHaveLength(1);

      await updateUseCase.execute({
        id: stationToUpdated.id,
        name: 'unique_name',
      });

      stations = (await repository.findAll()).stations;

      expect(stations).toHaveLength(1);
      expect(stations[0].name).toBe('unique_name');
      expect(stations[0].line).toBe('any_line2');
    });
  });
});
