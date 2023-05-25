import { CardRepository } from '../../../domain/card.repository';
import { AddCardUseCase } from './add-card.use-case';
import { AddCardUseCaseInputDto } from './add-card.use-case.dto';

const mockRepository = {
  save: vi.fn(),
  findById: vi.fn(),
  findTransactionsByCardId: vi.fn(),
};

const makeSut = (repository: CardRepository = mockRepository) => {
  return new AddCardUseCase(repository);
};

describe('AddCardUseCase', () => {
  it('should add a card', async () => {
    const repository = {
      save: vi.fn().mockResolvedValueOnce({
        card: {
          id: 1,
          name: 'any_name',
          balance: 100,
        },
      }),
      findById: vi.fn(),
      findTransactionsByCardId: vi.fn(),
    };

    const useCase = makeSut(repository);

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

  it('should throw if repository throws', async () => {
    const repository = {
      save: vi.fn().mockRejectedValueOnce(new Error()),
      findById: vi.fn(),
      findTransactionsByCardId: vi.fn(),
    };

    const useCase = makeSut(repository);

    const input: AddCardUseCaseInputDto = {
      name: 'any_name',
      balance: 100,
    };

    await expect(useCase.execute(input)).rejects.toThrow();
  });
});
