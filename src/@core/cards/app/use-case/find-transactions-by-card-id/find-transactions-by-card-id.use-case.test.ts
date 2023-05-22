import { CardInMemoryRepository } from '../../../infra/repository/in-memory/card.in-memory.repository';
import { FindTransactionsByCardIdUseCase } from './find-transactions-by-card-id.use-case';
import { FindTransactionsByCardIdUseCaseInputDto } from './find-transactions-by-card-id.use-case.dto';
import { Card } from '../../../domain/card';
import { CardMySQLRepository } from '../../../infra/repository/mysql/card.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';

const makeSut = (vendor: 'IN_MEMORY' | 'MYSQL' = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new CardMySQLRepository()
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
    const connection = MySQLConnection.getInstance();
    const database = process.env.DB_DATABASE_TEST;

    const truncateTables = () => {
      connection.query('SET FOREIGN_KEY_CHECKS = 0');
      connection.query(`TRUNCATE TABLE \`${database}\`.\`cards\``);
      connection.query(`TRUNCATE TABLE \`${database}\`.\`transactions\``);
      connection.query('SET FOREIGN_KEY_CHECKS = 1');
    };

    beforeEach(() => {
      truncateTables();
    });

    afterEach(() => {
      truncateTables();
    });

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
});
