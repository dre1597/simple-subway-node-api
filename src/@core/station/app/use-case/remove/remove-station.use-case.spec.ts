import { NotFoundException } from '#shared/domain/exception/not-found.exception';

import { Station } from '../../../domain/station';
import { StationRepository } from '../../../domain/station.repository';
import { RemoveStationUseCase } from './remove-station.use-case';

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
  return new RemoveStationUseCase(repository);
};

describe('RemoveStationUseCase', () => {
  it('should remove a station', async () => {
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

    await sut.execute({ id: 1 });
  });

  it('should throw an error if the station does not exist', async () => {
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

    const sut = makeSut(repository);

    await expect(async () => await sut.execute({ id: 1 })).rejects.toThrowError(
      new NotFoundException('Station', 'Station with id 1 not found'),
    );
  });

  it('should throw if repository throws', async () => {
    const repository = {
      save: vi.fn().mockRejectedValueOnce(new Error()),
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

    await expect(async () => await sut.execute({ id: 1 })).rejects.toThrow();
  });
});
