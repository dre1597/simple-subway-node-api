import {
  AddCardInputDto,
  CardFacadeInterface,
  UpdateCardInputDto,
} from './card.facade.interface';
import { AddCardUseCase } from '../use-case/add/add-card.use-case';
import { UpdateCardUseCase } from '../use-case/update/update-card.use-case';

export class CardFacade implements CardFacadeInterface {
  constructor(
    private readonly _addUseCase: AddCardUseCase,
    private readonly _updateUseCase: UpdateCardUseCase,
  ) {}

  public async add(input: AddCardInputDto): Promise<void> {
    await this._addUseCase.execute({ name: input.name });
  }

  public async update(input: UpdateCardInputDto): Promise<void> {
    await this._updateUseCase.execute({ id: input.id, name: input.name });
  }
}
