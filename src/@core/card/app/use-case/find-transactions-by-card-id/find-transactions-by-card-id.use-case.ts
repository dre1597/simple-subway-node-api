import { CardRepository } from '#card/domain/card.repository';
import { UseCaseInterface } from '#core/@seedwork/use-case.interface';

import {
  FindTransactionsByCardIdUseCaseInputDto,
  FindTransactionsByCardIdUseCaseOutputDto,
} from './find-transactions-by-card-id.use-case.dto';

export class FindTransactionsByCardIdUseCase implements UseCaseInterface {
  constructor(private readonly cardRepository: CardRepository) {}

  public async execute(
    input: FindTransactionsByCardIdUseCaseInputDto,
  ): Promise<FindTransactionsByCardIdUseCaseOutputDto> {
    const { transactions } = await this.cardRepository.findTransactionsByCardId(
      {
        cardId: input.cardId,
      },
    );

    return {
      transactions: transactions.map((transaction) => {
        return {
          id: transaction.id,
          card: {
            id: transaction.card.id,
            name: transaction.card.name,
            balance: transaction.card.balance,
          },
          amount: transaction.amount,
          timestamp: transaction.timestamp,
        };
      }),
    };
  }
}
