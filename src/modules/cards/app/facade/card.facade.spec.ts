import { describe, expect, it } from 'vitest';

import { CardInMemoryRepository } from '../../infra/repository/in-memory/card.in-memory.repository';
import { CardFacade } from './card.facade';
import { AddCardUseCase } from '../use-case/add/add-card.use-case';
import { UpdateCardUseCase } from '../use-case/update/update-card.use-case';
import { Card } from '../../domain/card';
import { NotFoundException } from '../../../@shared/exception/not-found.exception';

const makeSut = () => {
  const repository = new CardInMemoryRepository();

  const addUseCase = new AddCardUseCase(repository);
  const updateUseCase = new UpdateCardUseCase(repository);

  const facade = new CardFacade(addUseCase, updateUseCase);

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
    const { facade, repository } = makeSut();

    const input = {
      id: 1,
      name: 'updated_name',
    };

    await expect(async () => await facade.update(input)).rejects.toThrow(
      NotFoundException,
    );
  });
});
