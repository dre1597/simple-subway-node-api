import { Collection } from 'mongodb';

import {
  CardRepository,
  FindCardByIdInputDto,
  FindCardByIdOutputDto,
  FindTransactionsByCardIdInputDto,
  FindTransactionsByCardIdOutputDto,
  SaveCardInputDto,
  SaveCardOutputDto,
} from '../../../domain/card.repository';
import { MongoHelper } from '../../../../@shared/infra/db/mongo/mongo-helper';
import { Card } from '../../../domain/card';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';
import { Transaction } from '../../../domain/transaction';

export class CardMongoRepository implements CardRepository {
  public async save(input: SaveCardInputDto): Promise<SaveCardOutputDto> {
    const collection = await this.getCollection();

    if (!input.card.id) {
      await this._insert(input, collection);
    } else {
      await this._update(input, collection);
    }

    const { card: savedCard } = await this.findById({
      id: input.card.id,
    });

    return {
      card: new Card({
        id: savedCard.id,
        name: savedCard.name,
        balance: savedCard.balance,
      }),
    };
  }

  public async findById(
    input: FindCardByIdInputDto,
  ): Promise<FindCardByIdOutputDto> {
    const collection = await this.getCollection();

    const card = await collection.findOne({ cardId: input.id });

    if (!card) {
      throw new NotFoundException('Card', `Card with id ${input.id} not found`);
    }

    return {
      card: new Card({
        id: card.cardId,
        name: card.name,
        balance: card.balance,
      }),
    };
  }

  public async findTransactionsByCardId(
    input: FindTransactionsByCardIdInputDto,
  ): Promise<FindTransactionsByCardIdOutputDto> {
    const collection = await this.getCollection('transactions');

    const transactions = await collection
      .find({
        cardId: input.cardId,
      })
      .toArray();

    return {
      transactions: transactions.map(
        (transaction) =>
          new Transaction({
            id: transaction.transactionId,
            card: new Card({
              id: transaction.cardId,
              name: transaction.cardName,
              balance: transaction.cardBalance,
            }),
            amount: transaction.amount,
            timestamp: transaction.timestamp,
          }),
      ),
    };
  }

  private async _insert(
    input: SaveCardInputDto,
    collection: Collection,
  ): Promise<void> {
    input.card.id = await this._getNextId();

    await collection.insertOne({
      cardId: input.card.id,
      name: input.card.name,
      balance: input.card.balance || 0,
    });
  }

  private async _update(
    input: SaveCardInputDto,
    collection: Collection,
  ): Promise<void> {
    const { card } = await this.findById({
      id: input.card.id,
    });

    await this._addTransaction(input.card, input.card.balance, card.balance);

    await collection.updateOne(
      { cardId: input.card.id },
      { $set: { name: input.card.name, balance: input.card.balance } },
    );
  }

  private async getCollection(name = 'cards'): Promise<Collection> {
    return await MongoHelper.getCollection(name);
  }

  private async _getNextId(name = 'cards'): Promise<number> {
    const collection = await this.getCollection(name);

    return (await collection.countDocuments()) + 1;
  }

  private async _addTransaction(
    card: Card,
    newBalance: number,
    oldBalance: number,
  ): Promise<void> {
    const transactionCollection = await this.getCollection('transactions');

    const transaction = new Transaction({
      card,
      id: await this._getNextId('transactions'),
      amount: newBalance - oldBalance,
      timestamp: new Date(),
    });

    await transactionCollection.insertOne({
      cardId: transaction.card.id,
      cardName: transaction.card.name,
      cardBalance: transaction.card.balance,
      amount: transaction.amount,
      timestamp: transaction.timestamp,
      transactionId: transaction.id,
    });
  }
}
