import {
  CardRepository,
  SaveCardInputDto,
  SaveCardOutputDto,
} from '../../../domain/card.repository';
import { Card } from '../../../domain/card';

export class CardInMemoryRepository implements CardRepository {
  private _cards: Card[] = [];

  public async save(input: SaveCardInputDto): Promise<SaveCardOutputDto> {
    if (!input.card.id) {
      input.card.id = this._cards[this._cards.length - 1]
        ? this._cards[this._cards.length - 1].id + 1
        : 1;
    }

    this._cards.push(input.card);

    return {
      card: input.card,
    };
  }
}
