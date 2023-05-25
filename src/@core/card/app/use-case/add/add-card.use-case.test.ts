import { CardInMemoryRepository } from '../../../infra/repository/in-memory/card.in-memory.repository';
import { AddCardUseCase } from './add-card.use-case';
import { AddCardUseCaseInputDto } from './add-card.use-case.dto';
import { CardMySQLRepository } from '../../../infra/repository/mysql/card.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql/mysql-connection';
import { MongoHelper } from '../../../../@shared/infra/db/mongo/mongo-helper';
import { CardMongoRepository } from '../../../infra/repository/mongo/card.mongo.repository';
import { RepositoryVendor } from '../../../../@shared/types/repository-vendor';

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
