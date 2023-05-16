import { describe, expect, it } from 'vitest';

import { CardInMemoryRepository } from '../../infra/repository/in-memory/card.in-memory.repository';
import { CardFacade } from './card.facade';
import { AddCardUseCase } from '../use-case/add/add-card.use-case';
import { UpdateCardUseCase } from '../use-case/update/update-card.use-case';
import { Card } from '../../domain/card';
import { NotFoundException } from '../../../@shared/exception/not-found.exception';
import { FindTransactionsByCardIdUseCase } from '../use-case/find-transactions-by-card-id/find-transactions-by-card-id.use-case';
import { FindTransactionsByCardIdUseCaseInputDto } from '../use-case/find-transactions-by-card-id/find-transactions-by-card-id.use-case.dto';

const makeSut = () => {
  const repository = new CardInMemoryRepository();

  const addUseCase = new AddCardUseCase(repository);
  const updateUseCase = new UpdateCardUseCase(repository);
  const findTransactionsByCardIdUseCase = new FindTransactionsByCardIdUseCase(
    repository,
  );

  const facade = new CardFacade(
    addUseCase,
    updateUseCase,
    findTransactionsByCardIdUseCase,
  );

  return { facade, repository };
};

describe('CardFacade', () => {
  it('should add a card', async () => {
    const { facade } = makeSut();

    const input = {
      name: 'any_name',
    };

    await expect(async () => await facade.add(input)).not.toThrow();
  });

  it('should update a card', async () => {
    const { facade, repository } = makeSut();

    const card = new Card({
      name: 'any_name',
    });

    await repository.save({
      card,
    });

    const input = {
      id: card.id,
      name: 'updated_name',
    };

    await expect(async () => await facade.update(input)).not.toThrow();
  });

  it('should throw NotFoundError when card not found on update', async () => {
    const { facade } = makeSut();

    const input = {
      id: 1,
      name: 'updated_name',
    };

    await expect(async () => await facade.update(input)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should find transactions by card id', async () => {
    const { facade, repository } = makeSut();

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

    await expect(
      async () => await facade.findTransactionsByCardId(input),
    ).not.toThrow();
  });
});
