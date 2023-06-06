import { Card } from '#card/domain/card';
import { CardInMemoryRepository } from '#card/infra/repository/in-memory/card.in-memory.repository';
import { CardMongoRepository } from '#card/infra/repository/mongo/card.mongo.repository';
import { CardMySQLRepository } from '#card/infra/repository/mysql/card.mysql.repository';
import { setupMySQL } from '#core/@seedwork/infra/testing/helpers/db';
import { MongoHelper } from '#shared/infra/db/mongo/mongo-helper';
import { RepositoryVendor } from '#shared/utils/repository-vendor';

import { FindTransactionsByCardIdUseCase } from './find-transactions-by-card-id.use-case';
import { FindTransactionsByCardIdUseCaseInputDto } from './find-transactions-by-card-id.use-case.dto';

const makeSut = (vendor: RepositoryVendor = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new CardMySQLRepository()
      : vendor === 'MONGO'
      ? new CardMongoRepository()
      : new CardInMemoryRepository();

  const findTransactionsByCardIdUseCase = new FindTransactionsByCardIdUseCase(
    repository,
  );

  return {
    repository,
    findTransactionsByCardIdUseCase,
  };
};

describe('FindTransactionsByCardIdUseCase', () => {
  describe('In Memory', () => {
    it('should find transactions by card id', async () => {
      const { findTransactionsByCardIdUseCase, repository } = makeSut();

      let input: FindTransactionsByCardIdUseCaseInputDto = {
        cardId: 1,
      };

      let output = await findTransactionsByCardIdUseCase.execute(input);

      expect(output.transactions).toHaveLength(0);

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

      input = {
        cardId: 1,
      };

      output = await findTransactionsByCardIdUseCase.execute(input);

      expect(output.transactions).toHaveLength(1);
      expect(output.transactions[0].id).toBe(1);
      expect(output.transactions[0].card.id).toBe(1);
      expect(output.transactions[0].card.name).toBe('any_name');
      expect(output.transactions[0].card.balance).toBe(100);
      expect(output.transactions[0].amount).toBe(100);
      expect(output.transactions[0].timestamp).toBeInstanceOf(Date);
    });
  });

  describe('MYSQL', () => {
    setupMySQL('cards');

    it('should find transactions by card id', async () => {
      const { findTransactionsByCardIdUseCase, repository } = makeSut('MYSQL');

      let input: FindTransactionsByCardIdUseCaseInputDto = {
        cardId: 1,
      };

      let output = await findTransactionsByCardIdUseCase.execute(input);

      expect(output.transactions).toHaveLength(0);

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

      input = {
        cardId: 1,
      };

      output = await findTransactionsByCardIdUseCase.execute(input);

      expect(output.transactions.length).toBe(1);
      expect(output.transactions[0].id).toBe(1);
      expect(output.transactions[0].card.id).toBe(1);
      expect(output.transactions[0].card.name).toBe('any_name');
      expect(output.transactions[0].card.balance).toBe(100);
      expect(output.transactions[0].amount).toBe(100);
      expect(output.transactions[0].timestamp).toBeInstanceOf(Date);
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

    it('should find transactions by card id', async () => {
      const { findTransactionsByCardIdUseCase, repository } = makeSut('MONGO');

      let input: FindTransactionsByCardIdUseCaseInputDto = {
        cardId: 1,
      };

      let output = await findTransactionsByCardIdUseCase.execute(input);

      expect(output.transactions).toHaveLength(0);

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

      input = {
        cardId: 1,
      };

      output = await findTransactionsByCardIdUseCase.execute(input);

      expect(output.transactions.length).toBe(1);
      expect(output.transactions[0].id).toBe(1);
      expect(output.transactions[0].card.id).toBe(1);
      expect(output.transactions[0].card.name).toBe('any_name');
      expect(output.transactions[0].card.balance).toBe(100);
      expect(output.transactions[0].amount).toBe(100);
      expect(output.transactions[0].timestamp).toBeInstanceOf(Date);
    });
  });
});
