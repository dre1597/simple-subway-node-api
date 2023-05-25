import { NotFoundException } from '#shared/exception/not-found.exception';
import { UniqueFieldException } from '#shared/exception/unique-field.exception';

import { Station } from '../../../domain/station';
import { StationRepository } from '../../../domain/station.repository';
import { UpdateStationUseCase } from './update-station.use-case';

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
  return new UpdateStationUseCase(repository);
};

describe('UpdateStationUseCase', () => {
  it('should update a station', async () => {
    const repository = {
      save: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'updated_name',
          line: 'updated_line',
        }),
      }),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'any_name',
          line: 'any_line',
          isDeleted: false,
        }),
      }),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'any_name',
          line: 'any_line',
          isDeleted: false,
        }),
        alreadyExists: false,
      }),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const useCase = makeSut(repository);

    const input = {
      id: 1,
      name: 'updated_name',
      line: 'updated_line',
    };

    const output = await useCase.execute(input);

    expect(output).toEqual({
      id: 1,
      name: 'updated_name',
      line: 'updated_line',
    });
  });

  it('should keep the name if its not present', async () => {
    const repository = {
      save: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'any_name',
          line: 'any_line',
        }),
      }),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'any_name',
          line: 'any_line',
          isDeleted: false,
        }),
      }),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'any_name',
          line: 'any_line',
          isDeleted: false,
        }),
        alreadyExists: false,
      }),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const useCase = makeSut(repository);

    const input = {
      id: 1,
      line: 'any_line',
    };

    const output = await useCase.execute(input);

    expect(output).toEqual({
      id: 1,
      name: 'any_name',
      line: 'any_line',
    });
  });

  it('should keep the line if its not present', async () => {
    const repository = {
      save: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'any_name',
          line: 'any_line',
        }),
      }),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'any_name',
          line: 'any_line',
          isDeleted: false,
        }),
      }),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'any_name',
          line: 'any_line',
          isDeleted: false,
        }),
        alreadyExists: false,
      }),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const useCase = makeSut(repository);

    const input = {
      id: 1,
      name: 'any_name',
    };

    const output = await useCase.execute(input);

    expect(output).toEqual({
      id: 1,
      name: 'any_name',
      line: 'any_line',
    });
  });

  it('should throw an error if there is not station', async () => {
    const repository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findById: vi
        .fn()
        .mockRejectedValueOnce(
          new NotFoundException('Station', 'Station with id 1 not found'),
        ),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn(),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const useCase = makeSut(repository);

    const input = {
      id: 1,
      name: 'any_name',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      new NotFoundException('Station', 'Station with id 1 not found'),
    );
  });

  it('should throws UniqueFieldException if there is a station with the same name', async () => {
    const repository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'unique_name',
          line: 'any_line',
          isDeleted: false,
        }),
      }),
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
      id: 1,
      name: 'unique_name',
      line: 'any_line',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      new UniqueFieldException('name', 'Name already exists'),
    );
  });

  it('should delete permanently a station if another one is updated to a deleted one', async () => {
    const repository = {
      save: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'deleted_name',
          line: 'any_line',
          isDeleted: false,
        }),
      }),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'any_name',
          line: 'any_line',
          isDeleted: false,
        }),
      }),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'deleted_name',
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
      id: 1,
      name: 'deleted_name',
      line: 'any_line',
    };

    await useCase.execute(input);

    expect(repository.delete).toHaveBeenCalledTimes(1);
  });
});
