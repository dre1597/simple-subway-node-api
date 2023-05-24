import { CardInMemoryRepository } from '../../../infra/repository/in-memory/card.in-memory.repository';
import { UpdateCardUseCase } from './update-card.use-case';
import { Card } from '../../../domain/card';
import { UpdateCardUseCaseInputDto } from './update-card.use-case.dto';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';
import { CardMySQLRepository } from '../../../infra/repository/mysql/card.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql/mysql-connection';

const makeSut = (vendor: 'IN_MEMORY' | 'MYSQL' = 'IN_MEMORY') => {
  const repository =
    vendor === 'MYSQL'
      ? new CardMySQLRepository()
      : new CardInMemoryRepository();

  const updateUseCase = new UpdateCardUseCase(repository);

  return {
    repository,
    updateUseCase,
  };
};

describe('UpdateCardUseCase', () => {
  describe('In Memory', () => {
    it('should update a card', async () => {
      const { updateUseCase, repository } = makeSut();

      const card = new Card({
        name: 'any_name',
      });

      await repository.save({ card });

      const input: UpdateCardUseCaseInputDto = {
        id: card.id,
        name: 'updated_name',
        balance: 100,
      };

      const output = await updateUseCase.execute(input);

      expect(output.id).toBe(card.id);
      expect(output.name).toBe(input.name);
      expect(output.balance).toBe(input.balance);
    });

    it('should throws NotFoundException if card not found', async () => {
      const { updateUseCase } = makeSut();

      const input: UpdateCardUseCaseInputDto = {
        id: 1,
        name: 'updated_name',
      };

      await expect(updateUseCase.execute(input)).rejects.toThrowError(
        new NotFoundException('Card', `Card with id ${input.id} not found`),
      );
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

    it('should update a card', async () => {
      const { updateUseCase, repository } = makeSut();

      const card = new Card({
        name: 'any_name',
      });

      await repository.save({ card });

      const input: UpdateCardUseCaseInputDto = {
        id: card.id,
        name: 'updated_name',
        balance: 100,
      };

      const output = await updateUseCase.execute(input);

      expect(output.id).toBe(card.id);
      expect(output.name).toBe(input.name);
      expect(output.balance).toBe(input.balance);
    });

    it('should throws NotFoundException if card not found', async () => {
      const { updateUseCase } = makeSut();

      const input: UpdateCardUseCaseInputDto = {
        id: 1,
        name: 'updated_name',
      };

      await expect(updateUseCase.execute(input)).rejects.toThrowError(
        new NotFoundException('Card', `Card with id ${input.id} not found`),
      );
    });
  });
});
