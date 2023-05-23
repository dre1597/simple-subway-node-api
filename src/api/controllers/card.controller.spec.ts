import { CardController } from './card.controller';

const mockFacade = {
  add: vi.fn(),
  update: vi.fn(),
  findTransactionsByCardId: vi.fn(),
};

const makeSut = (facade = mockFacade) => {
  return new CardController(facade);
};

describe('CardController', () => {
  describe('Add', () => {
    it('should add card', async () => {
      const sut = makeSut();

      await sut.add('any_name', 100);

      expect(mockFacade.add).toHaveBeenCalledWith({
        name: 'any_name',
        balance: 100,
      });
    });

    it('should throw when use case throws', async () => {
      const facade = {
        add: vi.fn().mockRejectedValueOnce(new Error()),
        update: vi.fn(),
        findTransactionsByCardId: vi.fn(),
      };

      const sut = makeSut(facade);

      await expect(
        async () => await sut.add('any_name', 100),
      ).rejects.toThrow();
    });
  });

  describe('Update', () => {
    it('should update card', async () => {
      const sut = makeSut();

      await sut.update(1, 'any_name', 100);

      expect(mockFacade.update).toHaveBeenCalledWith({
        id: 1,
        name: 'any_name',
        balance: 100,
      });
    });

    it('should throw when use case throws', async () => {
      const facade = {
        add: vi.fn(),
        update: vi.fn().mockRejectedValueOnce(new Error()),
        findTransactionsByCardId: vi.fn(),
      };

      const sut = makeSut(facade);

      await expect(
        async () => await sut.update(1, 'any_name', 100),
      ).rejects.toThrow();
    });
  });

  describe('FindTransactionsByCardId', () => {
    it('should find transactions by card id', async () => {
      const sut = makeSut();

      await sut.findTransactionsByCardId(1);

      expect(mockFacade.findTransactionsByCardId).toHaveBeenCalledWith({
        cardId: 1,
      });
    });

    it('should throw when use case throws', async () => {
      const facade = {
        add: vi.fn(),
        update: vi.fn(),
        findTransactionsByCardId: vi.fn().mockRejectedValueOnce(new Error()),
      };

      const sut = makeSut(facade);

      await expect(
        async () => await sut.findTransactionsByCardId(1),
      ).rejects.toThrow();
    });
  });
});
