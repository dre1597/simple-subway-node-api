import { CardInMemoryRepository } from '../../infra/repository/in-memory/card.in-memory.repository';
import { CardFacade } from './card.facade';
import { AddCardUseCase } from '../use-case/add/add-card.use-case';
import { UpdateCardUseCase } from '../use-case/update/update-card.use-case';
import { Card } from '../../domain/card';
import { NotFoundException } from '../../../@shared/exception/not-found.exception';
import { FindTransactionsByCardIdUseCase } from '../use-case/find-transactions-by-card-id/find-transactions-by-card-id.use-case';
import { FindTransactionsByCardIdUseCaseInputDto } from '../use-case/find-transactions-by-card-id/find-transactions-by-card-id.use-case.dto';
import { CardMySQLRepository } from '../../infra/repository/mysql/card.mysql.repository';
import { MySQLConnection } from '../../../@shared/infra/db/mysql/mysql-connection';
import { CardMongoRepository } from '../../infra/repository/mongo/card.mongo.repository';
import { RepositoryVendor } from '../../../@shared/types/repository-vendor';
import { MongoHelper } from '../../../@shared/infra/db/mongo/mongo-helper';

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

  describe('MYSQL', () => {
    const connection = MySQLConnection.getInstance();

    const truncateTables = async () => {
      const database = process.env.DB_DATABASE_TEST;

      await connection.query('SET FOREIGN_KEY_CHECKS = 0');
      await connection.query(`TRUNCATE TABLE \`${database}\`.\`cards\``);
      await connection.query(`TRUNCATE TABLE \`${database}\`.\`transactions\``);
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    };

    beforeEach(async () => {
      await truncateTables();
    });

    afterEach(async () => {
      await truncateTables();
    });

    it('should add a card', async () => {
      const { facade } = makeSut('MYSQL');

      const input = {
        name: 'any_name',
      };

      await expect(async () => await facade.add(input)).not.toThrow();
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

      await expect(async () => await facade.update(input)).not.toThrow();
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

      await expect(
        async () => await facade.findTransactionsByCardId(input),
      ).not.toThrow();
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

    afterAll(() => {
      console.log('finish all');
    });

    it('should add a card', async () => {
      const { facade } = makeSut('MONGO');

      const input = {
        name: 'any_name',
      };

      await expect(async () => await facade.add(input)).not.toThrow();
    });

    // it('should update a card', async () => {
    //   const { facade, repository } = makeSut('MONGO');
    //
    //   const card = new Card({
    //     name: 'any_name',
    //   });
    //
    //   await repository.save({
    //     card,
    //   });
    //
    //   console.log(
    //     await (await MongoHelper.getCollection('cards')).find().toArray(),
    //   );
    //
    //   const input = {
    //     id: card.id,
    //     name: 'updated_name',
    //     balance: 10,
    //   };
    //
    //   await expect(async () => await facade.update(input)).not.toThrow();
    //
    //   console.log(
    //     await (await MongoHelper.getCollection('cards')).find().toArray(),
    //   );
    // });

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

      await expect(
        async () => await facade.findTransactionsByCardId(input),
      ).not.toThrow();
    });
  });
});
