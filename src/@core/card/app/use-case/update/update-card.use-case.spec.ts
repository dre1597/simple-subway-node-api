import { Card } from '#card/domain/card';
import { CardRepository } from '#card/domain/card.repository';
import { NotFoundException } from '#shared/domain/exception/not-found.exception';

import { UpdateCardUseCase } from './update-card.use-case';
import { UpdateCardUseCaseInputDto } from './update-card.use-case.dto';

const mockRepository = {
  save: vi.fn(),
  findById: vi.fn(),
  findTransactionsByCardId: vi.fn(),
};

const makeSut = (repository: CardRepository = mockRepository) => {
  return new UpdateCardUseCase(repository);
};

describe('UpdateCardUseCase', () => {
  it('should update a card', async () => {
    const repository = {
      save: vi.fn().mockResolvedValueOnce({
        card: {
          id: 1,
          name: 'any_name',
          balance: 100,
        },
      }),
      findById: vi.fn().mockResolvedValueOnce({
        card: new Card({
          id: 1,
          name: 'any_name',
          balance: 100,
        }),
      }),
      findTransactionsByCardId: vi.fn(),
    };

    const useCase = makeSut(repository);

    const input: UpdateCardUseCaseInputDto = {
      id: 1,
      name: 'any_name',
      balance: 100,
    };

    const output = await useCase.execute(input);

    expect(output).toEqual({
      id: 1,
      name: 'any_name',
      balance: 100,
    });
  });

  it('should throw if repository throws', async () => {
    const repository = {
      save: vi.fn().mockRejectedValueOnce(new Error()),
      findById: vi.fn(),
      findTransactionsByCardId: vi.fn(),
    };

    const useCase = makeSut(repository);

    const input: UpdateCardUseCaseInputDto = {
      id: 1,
      name: 'any_name',
      balance: 100,
    };

    await expect(useCase.execute(input)).rejects.toThrow();
  });

  it('should throw if card not found', async () => {
    const repository = {
      save: vi.fn(),
      findById: vi
        .fn()
        .mockRejectedValueOnce(
          new NotFoundException('any_entity', 'any_message'),
        ),
      findTransactionsByCardId: vi.fn(),
    };

    const useCase = makeSut(repository);

    const input: UpdateCardUseCaseInputDto = {
      id: 1,
      name: 'any_name',
      balance: 100,
    };

    await expect(useCase.execute(input)).rejects.toThrow();
  });
});
