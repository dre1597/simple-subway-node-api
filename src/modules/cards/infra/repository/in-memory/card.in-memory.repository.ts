import {
  CardRepository,
  FindCardByIdInputDto,
  FindCardByIdOutputDto,
  SaveCardInputDto,
  SaveCardOutputDto,
} from '../../../domain/card.repository';
import { Card } from '../../../domain/card';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';

export class CardInMemoryRepository implements CardRepository {
  private _cards: Card[] = [];

  public async save(input: SaveCardInputDto): Promise<SaveCardOutputDto> {
    if (!input.card.id) {
      input.card.id = this._cards[this._cards.length - 1]
        ? this._cards[this._cards.length - 1].id + 1
        : 1;
      this._cards.push(input.card);
    }

    return {
      card: input.card,
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
      card,
    };
  }
}
