import { Card } from '#card/domain/card';
import {
  CardRepository,
  FindCardByIdInputDto,
  FindCardByIdOutputDto,
  FindTransactionsByCardIdInputDto,
  FindTransactionsByCardIdOutputDto,
  SaveCardInputDto,
  SaveCardOutputDto,
} from '#card/domain/card.repository';
import { Transaction } from '#card/domain/transaction';
import { NotFoundException } from '#shared/domain/exception/not-found.exception';
import { MySQLConnection } from '#shared/infra/db/mysql/mysql-connection';

export class CardMySQLRepository implements CardRepository {
  private connection: MySQLConnection;

  constructor() {
    this.connection = MySQLConnection.getInstance();
  }

  public async save(input: SaveCardInputDto): Promise<SaveCardOutputDto> {
    if (!input.card.id) {
      await this._insert(input);
    } else {
      await this._update(input);
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
    const [card] = await this.connection.query(
      'SELECT * FROM cards WHERE id = ?',
      [input.id],
    );

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
    const transactions = await this.connection.query(
      `SELECT t.id        as transaction_id,
              t.card_id   as card_id,
              t.amount    as amount,
              t.timestamp as timestamp,
              c.name      as name,
              c.balance   as balance
       FROM transactions as t
                JOIN cards as c ON t.card_id = c.id
       WHERE t.card_id = ?`,
      [input.cardId],
    );

    return {
      transactions: transactions.map(
        (transaction) =>
          new Transaction({
            id: transaction.transaction_id,
            card: new Card({
              id: transaction.card_id,
              name: transaction.name,
              balance: transaction.balance,
            }),
            amount: transaction.amount,
            timestamp: transaction.timestamp,
          }),
      ),
    };
  }

  private async _insert(input: SaveCardInputDto): Promise<void> {
    const cardCreated = await this.connection.query(
      'INSERT INTO cards (name, balance) VALUES (?, ?)',
      [input.card.name, input.card.balance || 0],
    );

    input.card.id = cardCreated.insertId;
  }

  private async _update(input: SaveCardInputDto): Promise<void> {
    await this.connection.query(
      'UPDATE cards SET name = ?, balance = ? WHERE id = ?',
      [input.card.name, input.card.balance, input.card.id],
    );
  }
}
