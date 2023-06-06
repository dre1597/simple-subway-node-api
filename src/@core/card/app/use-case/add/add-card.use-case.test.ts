import { CardInMemoryRepository } from '#card/infra/repository/in-memory/card.in-memory.repository';
import { CardMongoRepository } from '#card/infra/repository/mongo/card.mongo.repository';
import { CardMySQLRepository } from '#card/infra/repository/mysql/card.mysql.repository';
import { RepositoryVendor } from '#shared/app/utils/repository-vendor';
import { setupMongoDB, setupMySQL } from '#shared/infra/testing/helpers/db';

import { AddCardUseCase } from './add-card.use-case';
import { AddCardUseCaseInputDto } from './add-card.use-case.dto';

const makeSut = (vendor: RepositoryVendor = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new CardMySQLRepository()
      : vendor === 'MONGO'
      ? new CardMongoRepository()
      : new CardInMemoryRepository();

  return new AddCardUseCase(repository);
};

describe('AddCardUseCase', () => {
  describe('In Memory', () => {
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

  describe('MYSQL', () => {
    setupMySQL('cards');

    it('should add a card', async () => {
      const useCase = makeSut('MYSQL');

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

  describe('MongoDB', () => {
    setupMongoDB('cards');

    it('should add a card', async () => {
      const useCase = makeSut('MONGO');

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
});
