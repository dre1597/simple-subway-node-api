import { CardFacadeInterface } from '../../@core/cards/app/facade/card.facade.interface';

export class CardController {
  constructor(private readonly facade: CardFacadeInterface) {}

  async add(name: string): Promise<void> {
    return await this.facade.add({ name });
  }

  async update(id: number, name?: string): Promise<void> {
    return await this.facade.update({ id, name });
  }
}
