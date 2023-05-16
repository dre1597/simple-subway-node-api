import { Card } from './card';

export type CreateTransactionInput = {
  id: number;
  card: Card;
  amount: number;
  timestamp: Date;
};

export class Transaction {
  private readonly _id: number;
  private readonly _card: Card;
  private readonly _amount: number;
  private readonly _timestamp: Date;

  constructor(input: CreateTransactionInput) {
    this._id = input.id;
    this._card = input.card;
    this._amount = input.amount;
    this._timestamp = input.timestamp;
  }

  public get id(): number {
    return this._id;
  }

  public get card(): Card {
    return this._card;
  }

  public get amount(): number {
    return this._amount;
  }

  public get timestamp(): Date {
    return this._timestamp;
  }
}
