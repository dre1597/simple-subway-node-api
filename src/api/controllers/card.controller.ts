import {
  CardFacadeInterface,
  FindTransactionsByCardIdOutputDto,
} from '../../@core/cards/app/facade/card.facade.interface';
import { AddCardValidator } from '../validators/add-card.validator';
import { UpdateCardValidator } from '../validators/update-card.validator';

export class CardController {
  constructor(private readonly facade: CardFacadeInterface) {}

  public async add(name: string, balance?: number): Promise<void> {
    await AddCardValidator.validate(name, balance);

    return await this.facade.add({ name, balance });
  }

  public async update(
    id: number,
    name?: string,
    balance?: number,
  ): Promise<void> {
    await UpdateCardValidator.validate(name, balance);

    return await this.facade.update({ id, name, balance });
  }

  public async findTransactionsByCardId(
    cardId: number,
  ): Promise<FindTransactionsByCardIdOutputDto> {
    return await this.facade.findTransactionsByCardId({ cardId });
  }
}
