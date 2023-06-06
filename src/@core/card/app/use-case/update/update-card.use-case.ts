import { CardRepository } from '#card/domain/card.repository';
import { UseCaseInterface } from '#shared/app/use-case.interface';

import {
  UpdateCardUseCaseInputDto,
  UpdateCardUseCaseOutputDto,
} from './update-card.use-case.dto';

export class UpdateCardUseCase implements UseCaseInterface {
  constructor(private readonly cardRepository: CardRepository) {}

  public async execute(
    input: UpdateCardUseCaseInputDto,
  ): Promise<UpdateCardUseCaseOutputDto> {
    const { card } = await this.cardRepository.findById({ id: input.id });

    card.update({
      name: input.name,
      balance: input.balance,
    });

    const { card: updatedCard } = await this.cardRepository.save({
      card,
    });

    return {
      id: updatedCard.id,
      name: updatedCard.name,
      balance: updatedCard.balance,
    };
  }
}
