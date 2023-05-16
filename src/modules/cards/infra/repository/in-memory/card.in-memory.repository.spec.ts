import { describe, expect, it } from 'vitest';

import { CardInMemoryRepository } from './card.in-memory.repository';
import { Card, CreateCardInput } from '../../../domain/card';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';

const makeSut = () => new CardInMemoryRepository();

describe('CardInMemoryRepository', () => {
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

    cardInserted.update({
      name: 'updated_name',
      balance: 10,
    });

    const { card: cardUpdated } = await repository.save({
      card: cardInserted,
    });

    expect(cardUpdated.id).toBe(1);
    expect(cardUpdated.name).toBe('updated_name');
    expect(cardUpdated.balance).toBe(10);
  });

  it('should create a transaction when update the balance of a card', async () => {
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

    cardInserted.update({
      name: 'updated_name',
      balance: 10,
    });

    const { card: cardUpdated } = await repository.save({
      card: cardInserted,
    });

    expect(cardUpdated.id).toBe(1);
    expect(cardUpdated.name).toBe('updated_name');
    expect(cardUpdated.balance).toBe(10);

    const { transactions } = await repository.findTransactionsByCardId({
      cardId: cardUpdated.id,
    });

    expect(transactions).toHaveLength(1);
    expect(transactions[0].id).toBe(1);
    expect(transactions[0].card.id).toBe(cardUpdated.id);
    expect(transactions[0].amount).toBe(10);
    expect(transactions[0].timestamp).toBeDefined();

    cardUpdated.update({
      balance: -10,
    });

    const { card: cardUpdated2 } = await repository.save({
      card: cardUpdated,
    });

    const { transactions: transactionsUpdated } =
      await repository.findTransactionsByCardId({
        cardId: cardUpdated2.id,
      });

    expect(transactionsUpdated).toHaveLength(2);
    expect(transactionsUpdated[1].id).toBe(2);
    expect(transactionsUpdated[1].card.id).toBe(cardUpdated.id);
    expect(transactionsUpdated[1].amount).toBe(-20);
    expect(transactionsUpdated[1].timestamp).toBeDefined();
  });

  it('should find a card by id', async () => {
    const repository = makeSut();

    const props: CreateCardInput = {
      name: 'any_name',
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
      new NotFoundException('Card', 'Card with id 1 not found'),
    );
  });
});
