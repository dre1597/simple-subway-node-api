import { describe, expect, it } from 'vitest';

import { CardInMemoryRepository } from '../../../infra/repository/in-memory/card.in-memory.repository';
import { AddCardUseCase } from './add-card.use-case';
import { AddCardUseCaseInputDto } from './add-card.use-case.dto';

const makeSut = () => {
  const repository = new CardInMemoryRepository();
  return new AddCardUseCase(repository);
};

describe('AddCardUseCase', () => {
  it('should add a card', async () => {
    const useCase = makeSut();

    const input: AddCardUseCaseInputDto = {
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
});
