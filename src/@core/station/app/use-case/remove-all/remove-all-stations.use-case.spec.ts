import { RemoveAllStationsUseCase } from './remove-all-stations.use-case';
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
  return new RemoveAllStationsUseCase(repository);
};

describe('RemoveAllStationsUseCase', () => {
  it('should remove all stations', async () => {
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
      deleteAll: vi.fn().mockRejectedValueOnce(new Error()),
      restoreAll: vi.fn(),
    };

    const sut = makeSut(repository);

    await expect(async () => await sut.execute()).rejects.toThrow();
  });
});
