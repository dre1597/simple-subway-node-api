import { setupMySQL } from '#core/@seedwork/infra/testing/helpers/db';
import { NotFoundException } from '#shared/exception/not-found.exception';
import { MongoHelper } from '#shared/infra/db/mongo/mongo-helper';
import { RepositoryVendor } from '#shared/utils/repository-vendor';

import { Card } from '../../domain/card';
import { CardInMemoryRepository } from '../../infra/repository/in-memory/card.in-memory.repository';
import { CardMongoRepository } from '../../infra/repository/mongo/card.mongo.repository';
import { CardMySQLRepository } from '../../infra/repository/mysql/card.mysql.repository';
import { AddCardUseCase } from '../use-case/add/add-card.use-case';
import { FindTransactionsByCardIdUseCase } from '../use-case/find-transactions-by-card-id/find-transactions-by-card-id.use-case';
import { FindTransactionsByCardIdUseCaseInputDto } from '../use-case/find-transactions-by-card-id/find-transactions-by-card-id.use-case.dto';
import { UpdateCardUseCase } from '../use-case/update/update-card.use-case';
import { CardFacade } from './card.facade';

const makeSut = (vendor: RepositoryVendor = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new CardMySQLRepository()
      : vendor === 'MONGO'
      ? new CardMongoRepository()
      : new CardInMemoryRepository();

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
  describe('In Memory', () => {
    it('should add a card', async () => {
      const { facade } = makeSut();

      const input = {
        name: 'any_name',
      };

      await facade.add(input);
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

      await facade.update(input);
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

      await facade.findTransactionsByCardId(input);
    });
  });

  describe('MYSQL', () => {
    setupMySQL('cards');

    it('should add a card', async () => {
      const { facade } = makeSut('MYSQL');

      const input = {
        name: 'any_name',
      };

      await facade.add(input);
    });

    it('should update a card', async () => {
      const { facade, repository } = makeSut('MYSQL');

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

      await facade.update(input);
    });

    it('should throw NotFoundError when card not found on update', async () => {
      const { facade } = makeSut('MYSQL');

      const input = {
        id: 1,
        name: 'updated_name',
      };

      await expect(async () => await facade.update(input)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should find transactions by card id', async () => {
      const { facade, repository } = makeSut('MYSQL');

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

      await facade.findTransactionsByCardId(input);
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
      const { facade } = makeSut('MONGO');

      const input = {
        name: 'any_name',
      };

      await facade.add(input);
    });

    it('should update a card', async () => {
      const { facade, repository } = makeSut('MONGO');

      const card = new Card({
        name: 'any_name',
      });

      await repository.save({
        card,
      });

      const input = {
        id: card.id,
        name: 'updated_name',
        balance: 10,
      };

      await facade.update(input);
    });

    it('should throw NotFoundException when card not found on update', async () => {
      const { facade } = makeSut('MONGO');

      const input = {
        id: 1,
        name: 'updated_name',
      };

      await expect(async () => await facade.update(input)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should find transactions by card id', async () => {
      const { facade, repository } = makeSut('MONGO');

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

      await facade.findTransactionsByCardId(input);
    });
  });
});
