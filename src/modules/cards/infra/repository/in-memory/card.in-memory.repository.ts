import {
  CardRepository,
  FindCardByIdInputDto,
  FindCardByIdOutputDto,
  FindTransactionsByCardIdInputDto,
  FindTransactionsByCardIdOutputDto,
  SaveCardInputDto,
  SaveCardOutputDto,
} from '../../../domain/card.repository';
import { Card } from '../../../domain/card';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';
import { Transaction } from '../../../domain/transaction';

export class CardInMemoryRepository implements CardRepository {
  private _cards: Card[] = [];
  private _transactions: Transaction[] = [];

  public async save(input: SaveCardInputDto): Promise<SaveCardOutputDto> {
    if (!input.card.id) {
      input.card.id = this._cards[this._cards.length - 1]
        ? this._cards[this._cards.length - 1].id + 1
        : 1;
      this._cards.push(input.card);
    } else {
      const { card } = await this.findById({
        id: input.card.id,
      });

      this._addTransaction(input.card, input.card.balance, card.balance);

      const index = this._cards.findIndex((card) => card.id === input.card.id);

      this._cards[index] = input.card;
    }

    return {
      card: new Card({
        id: input.card.id,
        name: input.card.name,
        balance: input.card.balance,
      }),
    };
  }

  public async findById(
    input: FindCardByIdInputDto,
  ): Promise<FindCardByIdOutputDto> {
    const card = this._cards.find((card) => card.id === input.id);

    if (!card) {
      throw new NotFoundException('Card', `Card with id ${input.id} not found`);
    }

    return {
      card: new Card({
        id: card.id,
        name: card.name,
        balance: card.balance,
      }),
    };
  }

  public async findTransactionsByCardId(
    input: FindTransactionsByCardIdInputDto,
  ): Promise<FindTransactionsByCardIdOutputDto> {
    const transactions = this._transactions.filter(
      (transaction) => transaction.card.id === input.cardId,
    );

    return {
      transactions,
    };
  }

  private _addTransaction(
    card: Card,
    newBalance: number,
    oldBalance: number,
  ): void {
    const transaction = new Transaction({
      card,
      id: this._transactions[this._transactions.length - 1]
        ? this._transactions[this._transactions.length - 1].id + 1
        : 1,
      amount: newBalance - oldBalance,
      timestamp: new Date(),
    });

    this._transactions.push(transaction);
  }
}
