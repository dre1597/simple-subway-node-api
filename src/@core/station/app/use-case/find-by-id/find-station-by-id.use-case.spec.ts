import { NotFoundException } from '#shared/domain/exception/not-found.exception';

import { Station } from '../../../domain/station';
import { StationRepository } from '../../../domain/station.repository';
import { FindStationByIdUseCase } from './find-station-by-id.use-case';

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
  return new FindStationByIdUseCase(repository);
};

describe('FindStationByIdUseCase', () => {
  it('should find a station by id', async () => {
    const repository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValueOnce({
        station: new Station({
          id: 1,
          name: 'any_name1',
          line: 'any_line1',
        }),
      }),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn(),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const sut = makeSut(repository);

    const output = await sut.execute({
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
    const repository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findById: vi
        .fn()
        .mockRejectedValueOnce(
          new NotFoundException('Station', `Station with id 1 not found`),
        ),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn(),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const sut = makeSut(repository);

    const input = { id: 1 };

    await expect(async () => {
      await sut.execute(input);
    }).rejects.toThrowError(
      new NotFoundException('Station', `Station with id ${input.id} not found`),
    );
  });

  it('should throw if repository throws', async () => {
    const repository = {
      save: vi.fn().mockRejectedValueOnce(new Error()),
      findAll: vi.fn(),
      findById: vi.fn().mockRejectedValueOnce(new Error()),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn(),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const sut = makeSut(repository);

    const input = { id: 1 };

    await expect(async () => {
      await sut.execute(input);
    }).rejects.toThrow();
  });
});
