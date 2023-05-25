import { StationRepository } from '../../../domain/station.repository';
import { AddStationUseCase } from './add-station.use-case';
import {
  MAX_STATION_LINE_LENGTH,
  MAX_STATION_NAME_LENGTH,
  MIN_STATION_LINE_LENGTH,
  MIN_STATION_NAME_LENGTH,
  Station,
} from '../../../domain/station';
import { InvalidFieldException } from '../../../../@shared/exception/invalid-field.exception';
import { UniqueFieldException } from '../../../../@shared/exception/unique-field.exception';

const mockRepository = {
  save: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  findByName: vi.fn(),
  verifyNameAlreadyExists: vi.fn(),
  delete: vi.fn(),
  deleteAll: vi.fn(),
  restoreAll: vi.fn(),
};

const makeSut = (repository: StationRepository = mockRepository) => {
  return new AddStationUseCase(repository);
};

describe('AddStationUseCase', () => {
  it('should add a station', async () => {
    const repository = {
      save: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'any_name',
          line: 'any_line',
          isDeleted: false,
        }),
      }),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn().mockResolvedValueOnce({
        station: null,
        alreadyExists: false,
      }),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const useCase = makeSut(repository);

    const input = {
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
    const repository = {
      save: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'unique_name',
          line: 'any_line',
          isDeleted: false,
        }),
      }),
      findAll: vi.fn().mockReturnValueOnce({
        stations: [
          new Station({
            id: 1,
            name: 'unique_name',
            line: 'any_line',
            isDeleted: false,
          }),
        ],
      }),
      findById: vi.fn(),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'unique_name',
          line: 'any_line',
          isDeleted: true,
        }),
        alreadyExists: true,
      }),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const useCase = makeSut(repository);

    const input = {
      name: 'unique_name',
      line: 'any_line',
    };

    await useCase.execute(input);

    const { stations } = await repository.findAll();

    expect(stations).toHaveLength(1);
    expect(stations[0].isDeleted).toBe(false);
  });

  it('should throw when adding a station with a invalid name', async () => {
    const useCase = makeSut();

    const input = {
      name: 'an',
      line: 'any_line',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      new InvalidFieldException(
        'name',
        `Name must be between ${MIN_STATION_NAME_LENGTH} and ${MAX_STATION_NAME_LENGTH} characters long`,
      ),
    );

    input.name = 'a'.repeat(MAX_STATION_NAME_LENGTH + 1);

    await expect(useCase.execute(input)).rejects.toThrow(
      new InvalidFieldException(
        'name',
        `Name must be between ${MIN_STATION_NAME_LENGTH} and ${MAX_STATION_NAME_LENGTH} characters long`,
      ),
    );
  });

  it('should throw when adding a station with a invalid line', async () => {
    const useCase = makeSut();

    const input = {
      name: 'any_name',
      line: 'an',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      new InvalidFieldException(
        'line',
        `Line must be between ${MIN_STATION_LINE_LENGTH} and ${MAX_STATION_LINE_LENGTH} characters long`,
      ),
    );

    input.line = 'a'.repeat(MAX_STATION_LINE_LENGTH + 1);

    await expect(useCase.execute(input)).rejects.toThrow(
      new InvalidFieldException(
        'line',
        `Line must be between ${MIN_STATION_LINE_LENGTH} and ${MAX_STATION_LINE_LENGTH} characters long`,
      ),
    );
  });

  it('should throw when adding a station with a name already exists', async () => {
    const repository = {
      save: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'unique_name',
          line: 'any_line',
          isDeleted: false,
        }),
      }),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'unique_name',
          line: 'any_line',
          isDeleted: false,
        }),
        alreadyExists: true,
      }),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const useCase = makeSut(repository);

    const input = {
      name: 'unique_name',
      line: 'any_line',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      new UniqueFieldException('name', 'Name already exists'),
    );
  });

  it('should throw if repository throws', async () => {
    const repository = {
      save: vi.fn().mockRejectedValueOnce(new Error()),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn().mockResolvedValueOnce({
        station: null,
        alreadyExists: false,
      }),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const useCase = makeSut(repository);

    const input = {
      name: 'any_name',
      line: 'any_line',
    };

    await expect(useCase.execute(input)).rejects.toThrow();
  });
});
