import {
  CardFacadeInterface,
  FindTransactionsByCardIdOutputDto,
} from '../../@core/cards/app/facade/card.facade.interface';

export class CardController {
  constructor(private readonly facade: CardFacadeInterface) {}

  public async add(name: string): Promise<void> {
    return await this.facade.add({ name });
  }

  public async update(id: number, name?: string): Promise<void> {
    return await this.facade.update({ id, name });
  }

  public async findTransactionsByCardId(
    cardId: number,
  ): Promise<FindTransactionsByCardIdOutputDto> {
    return await this.facade.findTransactionsByCardId({ cardId });
  }
}
