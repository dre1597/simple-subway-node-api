import {
  CardRepository,
  SaveCardInputDto,
  SaveCardOutputDto,
} from '../../../domain/card.repository';
import { MySQLConnection } from '../../../../@shared/infra/db/mysql-connection';
import { Card } from '../../../domain/card';

export class CardMySQLRepository implements CardRepository {
  private connection: MySQLConnection;

  constructor() {
    this.connection = MySQLConnection.getInstance();
  }

  public async save(input: SaveCardInputDto): Promise<SaveCardOutputDto> {
    if (!input.card.id) {
      const cardCreated = await this.connection.query(
        'INSERT INTO cards (name) VALUES (?)',
        [input.card.name],
      );

      input.card.id = cardCreated.insertId;
    } else {
      await this.connection.query('UPDATE cards SET name = ? WHERE id = ?', [
        input.card.name,
        input.card.id,
      ]);
    }

    return {
      card: new Card({
        id: input.card.id,
        name: input.card.name,
      }),
    };
  }
}
