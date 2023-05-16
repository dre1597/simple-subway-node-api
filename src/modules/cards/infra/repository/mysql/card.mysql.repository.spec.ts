import { beforeEach, describe, expect, it } from 'vitest';

import { Card, CreateCardInput } from '../../../domain/card';
import { CardMySQLRepository } from './card.mysql.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';

const makeSut = () => new CardMySQLRepository();

describe('CardMySQLRepository', () => {
  beforeEach(() => {
    const connection = MySQLConnection.getInstance();

    const database = process.env.DB_DATABASE_TEST;

    connection.query('SET FOREIGN_KEY_CHECKS = 0');
    connection.query(`TRUNCATE TABLE \`${database}\`.\`cards\``);
    connection.query(`TRUNCATE TABLE \`${database}\`.\`transactions\``);
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
    expect(cardInserted.balance).toBe(0);

    props.name = 'any_name2';
    props.balance = 10;

    card = new Card(props);

    const { card: cardInserted2 } = await repository.save({
      card,
    });

    expect(cardInserted2.id).toBe(2);
    expect(cardInserted2.name).toBe(props.name);
    expect(cardInserted2.balance).toBe(10);
  });

  it('should update a card', async () => {
    const repository = makeSut();

    const props: CreateCardInput = {
      name: 'any_name',
    };

    const card = new Card(props);

    const { card: cardInserted } = await repository.save({
      card,
    });

    expect(cardInserted.id).toBe(1);
    expect(cardInserted.name).toBe(props.name);
    expect(cardInserted.balance).toBe(0);

    card.update({
      name: 'updated_name',
      balance: 10,
    });

    const { card: cardUpdated } = await repository.save({
      card,
    });

    expect(cardUpdated.id).toBe(1);
    expect(cardUpdated.name).toBe('updated_name');
    expect(cardUpdated.balance).toBe(10);
  });

  it('should find a card by id', async () => {
    const repository = makeSut();

    const props: CreateCardInput = {
      name: 'any_name',
      balance: 10,
    };

    const card = new Card(props);

    const { card: cardInserted } = await repository.save({
      card,
    });

    const { card: cardFound } = await repository.findById({
      id: cardInserted.id,
    });

    expect(cardFound.id).toBe(cardInserted.id);
    expect(cardFound.name).toBe(cardInserted.name);
    expect(cardFound.balance).toBe(cardInserted.balance);
  });

  it('should throw if card not found', async () => {
    const repository = makeSut();

    await expect(async () => {
      await repository.findById({
        id: 1,
      });
    }).rejects.toThrowError(
      new NotFoundException('card', 'Card with id 1 not found'),
    );
  });
});
