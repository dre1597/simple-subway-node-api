import { CardFacade } from './card.facade';

const mockUseCase = {
  execute: vi.fn(),
};

const mockUseCaseReject = {
  execute: vi.fn().mockRejectedValue(new Error()),
};

const mockFindTransactionsByCardIdUseCase = {
  execute: vi.fn().mockResolvedValue({
    transactions: [],
  }),
};

const makeSut = (
  addUseCase = mockUseCase,
  updateUseCase = mockUseCase,
  findTransactionsByCardIdUseCase = mockFindTransactionsByCardIdUseCase,
) => {
  return new CardFacade(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore diff constructor
    addUseCase,
    updateUseCase,
    findTransactionsByCardIdUseCase,
  );
};

describe('CardFacade', () => {
  describe('Add', () => {
    it('should execute add use case', async () => {
      const sut = makeSut();

      await sut.add({
        name: 'any_name',
        balance: 100,
      });

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        name: 'any_name',
        balance: 100,
      });
    });

    it('should throw when use case throws', async () => {
      const sut = makeSut(mockUseCaseReject);

      await expect(
        async () =>
          await sut.add({
            name: 'any_name',
            balance: 100,
          }),
      ).rejects.toThrow();
    });
  });

  describe('Update', () => {
    it('should execute update use case', async () => {
      const sut = makeSut();

      await sut.update({
        id: 1,
        name: 'any_name',
        balance: 100,
      });

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        id: 1,
        name: 'any_name',
        balance: 100,
      });
    });

    it('should throw when use case throws', async () => {
      const sut = makeSut(undefined, mockUseCaseReject);

      await expect(
        async () =>
          await sut.update({
            id: 1,
            name: 'any_name',
            balance: 100,
          }),
      ).rejects.toThrow();
    });
  });

  describe('FindTransactionsByCardId', () => {
    it('should execute findTransactionsByCardId use case', async () => {
      const sut = makeSut();

      await sut.findTransactionsByCardId({
        cardId: 1,
      });

      expect(mockFindTransactionsByCardIdUseCase.execute).toHaveBeenCalledWith({
        cardId: 1,
      });
    });

    it('should throw when use case throws', async () => {
      const sut = makeSut(undefined, undefined, mockUseCaseReject);

      await expect(
        async () =>
          await sut.findTransactionsByCardId({
            cardId: 1,
          }),
      ).rejects.toThrow();
    });
  });
});
