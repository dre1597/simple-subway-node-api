import { describe, expect, it } from 'vitest';

import { CardFacadeInterface } from './card.facade.interface';
import { CardInMemoryRepository } from '../../infra/repository/in-memory/card.in-memory.repository';
import { CardFacade } from './card.facade';
import { AddCardUseCase } from '../use-case/add/add-card.use-case';

const makeSut = (): CardFacadeInterface => {
  const repository = new CardInMemoryRepository();

  const addUseCase = new AddCardUseCase(repository);
  return new CardFacade(addUseCase);
};

describe('CardFacade', () => {
  it('should add a card', async () => {
    const facade = makeSut();

    const input = {
      name: 'any_name',
    };

    await expect(async () => await facade.add(input)).not.toThrow();
  });
});
