import { AddCardUseCase } from '../use-case/add/add-card.use-case';
import { FindTransactionsByCardIdUseCase } from '../use-case/find-transactions-by-card-id/find-transactions-by-card-id.use-case';
import { UpdateCardUseCase } from '../use-case/update/update-card.use-case';
import {
  AddCardInputDto,
  CardFacadeInterface,
  FindTransactionsByCardIdInputDto,
  FindTransactionsByCardIdOutputDto,
  UpdateCardInputDto,
} from './card.facade.interface';

export class CardFacade implements CardFacadeInterface {
  constructor(
    private readonly _addUseCase: AddCardUseCase,
    private readonly _updateUseCase: UpdateCardUseCase,
    private readonly _findTransactionsByCardIdUseCase: FindTransactionsByCardIdUseCase,
  ) {}

  public async add(input: AddCardInputDto): Promise<void> {
    await this._addUseCase.execute({
      name: input.name,
      balance: input.balance,
    });
  }

  public async update(input: UpdateCardInputDto): Promise<void> {
    await this._updateUseCase.execute({
      id: input.id,
      name: input.name,
      balance: input.balance,
    });
  }

  public async findTransactionsByCardId(
    input: FindTransactionsByCardIdInputDto,
  ): Promise<FindTransactionsByCardIdOutputDto> {
    const { transactions } =
      await this._findTransactionsByCardIdUseCase.execute(input);

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
