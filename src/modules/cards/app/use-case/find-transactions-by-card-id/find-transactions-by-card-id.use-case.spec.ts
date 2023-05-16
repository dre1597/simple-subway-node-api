import { describe, expect, it } from 'vitest';

import { CardInMemoryRepository } from '../../../infra/repository/in-memory/card.in-memory.repository';
import { FindTransactionsByCardIdUseCase } from './find-transactions-by-card-id.use-case';
import { FindTransactionsByCardIdUseCaseInputDto } from './find-transactions-by-card-id.use-case.dto';
import { Card } from '../../../domain/card';

const makeSut = () => {
  const repository = new CardInMemoryRepository();

  const findTransactionsByCardIdUseCase = new FindTransactionsByCardIdUseCase(
    repository,
  );

  return {
    repository,
    findTransactionsByCardIdUseCase,
  };
};

describe('FindTransactionsByCardIdUseCase', () => {
  it('should find transactions by card id', async () => {
    const { findTransactionsByCardIdUseCase, repository } = makeSut();

    const { card: cardInserted } = await repository.save({
      card: new Card({
        name: 'any_name',
        balance: 0,
      }),
    });

    cardInserted.update({
      balance: 100,
    });

    await repository.save({ card: cardInserted });

    const input: FindTransactionsByCardIdUseCaseInputDto = {
      cardId: 1,
    };

    const output = await findTransactionsByCardIdUseCase.execute(input);

    expect(output.transactions.length).toBe(1);
    expect(output.transactions[0].id).toBe(1);
    expect(output.transactions[0].card.id).toBe(1);
    expect(output.transactions[0].card.name).toBe('any_name');
    expect(output.transactions[0].card.balance).toBe(100);
    expect(output.transactions[0].amount).toBe(100);
    expect(output.transactions[0].timestamp).toBeInstanceOf(Date);
  });
});
