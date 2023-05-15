import { AddCardInputDto, CardFacadeInterface } from './card.facade.interface';
import { AddCardUseCase } from '../use-case/add/add-card.use-case';

export class CardFacade implements CardFacadeInterface {
  constructor(private readonly _addUseCase: AddCardUseCase) {}

  public async add(input: AddCardInputDto): Promise<void> {
    await this._addUseCase.execute({ name: input.name });
  }
}
