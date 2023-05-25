import { CardRepository } from '../../../domain/card.repository';
import {
  AddCardUseCaseInputDto,
  AddCardUseCaseOutputDto,
} from './add-card.use-case.dto';
import { Card } from '../../../domain/card';
import { UseCaseInterface } from '../../../../@seedwork/use-case.interface';

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
