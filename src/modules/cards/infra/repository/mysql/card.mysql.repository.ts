import {
  CardRepository,
  FindCardByIdInputDto,
  FindCardByIdOutputDto,
  SaveCardInputDto,
  SaveCardOutputDto,
} from '../../../domain/card.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';
import { Card } from '../../../domain/card';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';

export class CardMySQLRepository implements CardRepository {
  private connection: MySQLConnection;

  constructor() {
    this.connection = MySQLConnection.getInstance();
  }

  public async save(input: SaveCardInputDto): Promise<SaveCardOutputDto> {
    if (!input.card.id) {
      const cardCreated = await this.connection.query(
        'INSERT INTO cards (name, balance) VALUES (?, ?)',
        [input.card.name, input.card.balance || 0],
      );

      input.card.id = cardCreated.insertId;
    } else {
      await this.connection.query(
        'UPDATE cards SET name = ?, balance = ? WHERE id = ?',
        [input.card.name, input.card.balance, input.card.id],
      );
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
    const [card] = await this.connection.query(
      'SELECT * FROM cards WHERE id = ?',
      [input.id],
    );

    if (!card) {
      throw new NotFoundException('card', `Card with id ${input.id} not found`);
    }

    return {
      card: new Card({
        id: card.id,
        name: card.name,
        balance: card.balance,
      }),
    };
  }
}
