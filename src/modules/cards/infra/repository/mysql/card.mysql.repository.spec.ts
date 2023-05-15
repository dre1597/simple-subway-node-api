import { beforeEach, describe, expect, it } from 'vitest';
import { Card, CreateCardInput } from '../../../domain/card';
import { CardMySQLRepository } from './card.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';

const makeSut = () => new CardMySQLRepository();

describe('CardMySQLRepository', () => {
  beforeEach(() => {
    const connection = MySQLConnection.getInstance();

    const database = process.env.DB_DATABASE_TEST;

    connection.query('SET FOREIGN_KEY_CHECKS = 0');
    connection.query(`TRUNCATE TABLE \`${database}\`.\`cards\``);
    connection.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  it('should insert a card', async () => {
    const repository = makeSut();

    const props: CreateCardInput = {
      name: 'any_name1',
    };

    let card = new Card(props);

    const { card: cardInserted } = await repository.save({
      card,
    });

    expect(cardInserted.id).toBe(1);
    expect(cardInserted.name).toBe(props.name);

    props.name = 'any_name2';

    card = new Card(props);

    const { card: cardInserted2 } = await repository.save({
      card,
    });

    expect(cardInserted2.id).toBe(2);
    expect(cardInserted2.name).toBe(props.name);
  });
});
