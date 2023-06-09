import { StationRepository } from '../../../domain/station.repository';
import { RestoreAllStationsUseCase } from './restore-all-stations.use-case';

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
  return new RestoreAllStationsUseCase(repository);
};

describe('RestoreAllStationsUseCase', () => {
  it('should restore all stations', async () => {
    await makeSut().execute();
  });

  it('should throw if repository throws', async () => {
    const repository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      verifyNameAlreadyExists: vi.fn(),
      delete: vi.fn(),
      deleteAll: vi.fn(),
      restoreAll: vi.fn().mockRejectedValueOnce(new Error()),
    };

    const sut = makeSut(repository);

    await expect(async () => await sut.execute()).rejects.toThrow();
  });
});
