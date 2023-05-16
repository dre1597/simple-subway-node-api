import {
  UpdateCardUseCaseInputDto,
  UpdateCardUseCaseOutputDto,
} from './update-card.use-case.dto';
import { CardRepository } from '../../../domain/card.repository';

export class UpdateCardUseCase {
  constructor(private readonly cardRepository: CardRepository) {}

  public async execute(
    input: UpdateCardUseCaseInputDto,
  ): Promise<UpdateCardUseCaseOutputDto> {
    const { card } = await this.cardRepository.findById({ id: input.id });

    card.update({
      name: input.name,
    });

    const { card: updatedCard } = await this.cardRepository.save({
      card,
    });

    return {
      id: updatedCard.id,
      name: updatedCard.name,
    };
  }
}
