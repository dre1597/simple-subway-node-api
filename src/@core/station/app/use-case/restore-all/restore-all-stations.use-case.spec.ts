import { RestoreAllStationsUseCase } from './restore-all-stations.use-case';
import { StationRepository } from '../../../domain/station.repository';

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
    await expect(async () => await makeSut().execute()).not.toThrow();
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
