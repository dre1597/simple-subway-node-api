import { FindAllStationsUseCase } from './find-all-stations.use-case';
import { StationRepository } from '../../../domain/station.repository';
import { Station } from '../../../domain/station';

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
  return new FindAllStationsUseCase(repository);
};

describe('FindAllStationsUseCase', () => {
  it('should find all stations', async () => {
    const repository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValueOnce({
        stations: [
          new Station({
            id: 1,
            name: 'any_name1',
            line: 'any_line1',
            isDeleted: false,
          }),
          new Station({
            id: 2,
            name: 'any_name2',
            line: 'any_line2',
            isDeleted: false,
          }),
        ],
      }),
      findById: vi.fn(),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn(),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const useCase = makeSut(repository);

    const output = await useCase.execute();

    expect(output.stations).toHaveLength(2);
    expect(output).toEqual({
      stations: [
        {
          id: 1,
          name: 'any_name1',
          line: 'any_line1',
        },
        {
          id: 2,
          name: 'any_name2',
          line: 'any_line2',
        },
      ],
    });
  });

  it('should return an empty array if there is not stations', async () => {
    const repository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValueOnce({
        stations: [],
      }),
      findById: vi.fn(),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn(),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const useCase = makeSut(repository);

    const output = await useCase.execute();

    expect(output.stations).toHaveLength(0);
  });

  it('should throw if repository throws', async () => {
    const repository = {
      save: vi.fn(),
      findAll: vi.fn().mockRejectedValueOnce(new Error()),
      findById: vi.fn(),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn(),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn(),
    };

    const useCase = makeSut(repository);

    await expect(async () => {
      await useCase.execute();
    }).rejects.toThrowError();
  });
});
