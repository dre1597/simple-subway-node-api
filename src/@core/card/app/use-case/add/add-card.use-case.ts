import { Card } from '#card/domain/card';
import { CardRepository } from '#card/domain/card.repository';
import { UseCaseInterface } from '#core/@seedwork/use-case.interface';

import {
  AddCardUseCaseInputDto,
  AddCardUseCaseOutputDto,
} from './add-card.use-case.dto';

export class AddCardUseCase implements UseCaseInterface {
  constructor(private readonly cardRepository: CardRepository) {}

  public async execute(
    input: AddCardUseCaseInputDto,
  ): Promise<AddCardUseCaseOutputDto> {
    const card = new Card({
      name: input.name,
      balance: input.balance,
    });

    const { card: cardInserted } = await this.cardRepository.save({
      card,
    });

    return {
      id: cardInserted.id,
      name: cardInserted.name,
      balance: cardInserted.balance,
    };
  }
}
