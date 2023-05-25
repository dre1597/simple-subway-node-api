import { Card } from '#card/domain/card';
import { CardRepository } from '#card/domain/card.repository';
import { Transaction } from '#card/domain/transaction';

import { FindTransactionsByCardIdUseCase } from './find-transactions-by-card-id.use-case';
import { FindTransactionsByCardIdUseCaseInputDto } from './find-transactions-by-card-id.use-case.dto';

const mockRepository = {
  save: vi.fn(),
  findById: vi.fn(),
  findTransactionsByCardId: vi.fn(),
};

const makeSut = (repository: CardRepository = mockRepository) => {
  return new FindTransactionsByCardIdUseCase(repository);
};

describe('FindTransactionsByCardIdUseCase', () => {
  it('should find transactions by card id', async () => {
    const now = new Date();

    const repository = {
      save: vi.fn(),
      findById: vi.fn(),
      findTransactionsByCardId: vi.fn().mockResolvedValueOnce({
        transactions: [
          new Transaction({
            id: 1,
            card: new Card({
              id: 1,
              name: 'any_name',
              balance: 100,
            }),
            amount: 100,
            timestamp: now,
          }),
        ],
      }),
    };

    const useCase = makeSut(repository);

    const input: FindTransactionsByCardIdUseCaseInputDto = {
      cardId: 1,
    };

    const output = await useCase.execute(input);

    expect(output).toEqual({
      transactions: [
        {
          id: 1,
          card: {
            id: 1,
            name: 'any_name',
            balance: 100,
          },
          amount: 100,
          timestamp: now,
        },
      ],
    });
  });

  it('should throw if repository throws', async () => {
    const repository = {
      save: vi.fn(),
      findById: vi.fn(),
      findTransactionsByCardId: vi.fn().mockRejectedValueOnce(new Error()),
    };

    const useCase = makeSut(repository);

    const input: FindTransactionsByCardIdUseCaseInputDto = {
      cardId: 1,
    };

    await expect(useCase.execute(input)).rejects.toThrow();
  });
});
