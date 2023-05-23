import { StationFacade } from './station.facade';

const mockUseCase = {
  execute: vi.fn(),
};

const mockUseCaseReject = {
  execute: vi.fn().mockRejectedValue(new Error()),
};

const makeSut = (
  addUseCase = mockUseCase,
  findAllUseCase = mockUseCase,
  findByIdUseCase = mockUseCase,
  updateUseCase = mockUseCase,
  removeUseCase = mockUseCase,
  removeAllUseCase = mockUseCase,
  restoreAllUseCase = mockUseCase,
) => {
  return new StationFacade(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore diff constructor
    addUseCase,
    findAllUseCase,
    findByIdUseCase,
    updateUseCase,
    removeUseCase,
    removeAllUseCase,
    restoreAllUseCase,
  );
};

describe('StationFacade', () => {
  describe('Add', () => {
    it('should execute add use case', async () => {
      const sut = makeSut();

      await sut.add({
        name: 'any_name',
        line: 'any_line',
      });

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        name: 'any_name',
        line: 'any_line',
      });
    });

    it('should throw when use case throws', async () => {
      const sut = makeSut(mockUseCaseReject);

      await expect(async () => {
        await sut.add({
          name: 'any_name',
          line: 'any_line',
        });
      }).rejects.toThrow();
    });
  });

  describe('FindAll', () => {
    it('should execute findAll use case', async () => {
      const sut = makeSut();

      await sut.findAll();

      expect(mockUseCase.execute).toHaveBeenCalled();
    });

    it('should throw when use case throws', async () => {
      const sut = makeSut(undefined, mockUseCaseReject);

      await expect(async () => {
        await sut.findAll();
      }).rejects.toThrow();
    });
  });

  describe('FindById', () => {
    it('should execute findById use case', async () => {
      const sut = makeSut();

      await sut.findById({
        id: 1,
      });

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        id: 1,
      });
    });

    it('should throw when use case throws', async () => {
      const sut = makeSut(undefined, undefined, mockUseCaseReject);

      await expect(async () => {
        await sut.findById({
          id: 1,
        });
      }).rejects.toThrow();
    });
  });

  describe('Update', () => {
    it('should execute update use case', async () => {
      const sut = makeSut();

      await sut.update({
        id: 1,
        name: 'any_name',
        line: 'any_line',
      });

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        id: 1,
        name: 'any_name',
        line: 'any_line',
      });
    });

    it('should throw when use case throws', async () => {
      const sut = makeSut(undefined, undefined, undefined, mockUseCaseReject);

      await expect(async () => {
        await sut.update({
          id: 1,
          name: 'any_name',
          line: 'any_line',
        });
      }).rejects.toThrow();
    });
  });

  describe('Remove', () => {
    it('should execute remove use case', async () => {
      const sut = makeSut();

      await sut.remove({
        id: 1,
      });

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        id: 1,
      });
    });

    it('should throw when use case throws', async () => {
      const sut = makeSut(
        undefined,
        undefined,
        undefined,
        undefined,
        mockUseCaseReject,
      );

      await expect(async () => {
        await sut.remove({
          id: 1,
        });
      }).rejects.toThrow();
    });
  });

  describe('RemoveAll', () => {
    it('should execute removeAll use case', async () => {
      const sut = makeSut();

      await sut.removeAll();

      expect(mockUseCase.execute).toHaveBeenCalled();
    });

    it('should throw when use case throws', async () => {
      const sut = makeSut(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        mockUseCaseReject,
      );

      await expect(async () => {
        await sut.removeAll();
      }).rejects.toThrow();
    });
  });

  describe('RestoreAll', () => {
    it('should execute restoreAll use case', async () => {
      const sut = makeSut();

      await sut.restoreAll();

      expect(mockUseCase.execute).toHaveBeenCalled();
    });

    it('should throw when use case throws', async () => {
      const sut = makeSut(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        mockUseCaseReject,
      );

      await expect(async () => {
        await sut.restoreAll();
      }).rejects.toThrow();
    });
  });
});
