import { CardInMemoryRepository } from '#card/infra/repository/in-memory/card.in-memory.repository';
import { CardMongoRepository } from '#card/infra/repository/mongo/card.mongo.repository';
import { CardMySQLRepository } from '#card/infra/repository/mysql/card.mysql.repository';
import { setupMySQL } from '#core/@seedwork/infra/testing/helpers/db';
import { MongoHelper } from '#shared/infra/db/mongo/mongo-helper';
import { RepositoryVendor } from '#shared/utils/repository-vendor';

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
    const truncateTables = async () => {
      const cardsCollection = await MongoHelper.getCollection('cards');

      await cardsCollection.deleteMany({});

      const transactionsCollection = await MongoHelper.getCollection(
        'transactions',
      );

      await transactionsCollection.deleteMany({});
    };

    beforeEach(async () => {
      await truncateTables();
    });

    afterEach(async () => {
      await truncateTables();
    });

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
