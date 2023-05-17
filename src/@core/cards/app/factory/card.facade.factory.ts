import { CardRepository } from '../../domain/card.repository';
import { CardFacade } from '../facade/card.facade';
import { InvalidRepositoryVendorException } from '../../../@shared/exception/invalid-repository-vendor.exception';
import { CardInMemoryRepository } from '../../infra/repository/in-memory/card.in-memory.repository';
import { CardMySQLRepository } from '../../infra/repository/mysql/card.mysql.repository';
import { AddCardUseCase } from '../use-case/add/add-card.use-case';
import { UpdateCardUseCase } from '../use-case/update/update-card.use-case';
import { FindTransactionsByCardIdUseCase } from '../use-case/find-transactions-by-card-id/find-transactions-by-card-id.use-case';

export class CardFacadeFactory {
  private static _repository: CardRepository;

  public static create(
    vendor: 'MYSQL' | 'IN_MEMORY' = 'IN_MEMORY',
  ): CardFacade {
    if (vendor === 'MYSQL') {
      this._repository = new CardMySQLRepository();
    } else if (vendor === 'IN_MEMORY') {
      this._repository = new CardInMemoryRepository();
    } else {
      throw new InvalidRepositoryVendorException();
    }

    const addUseCase = new AddCardUseCase(this._repository);
    const updateUseCase = new UpdateCardUseCase(this._repository);
    const findTransactionsByCardIdUseCase = new FindTransactionsByCardIdUseCase(
      this._repository,
    );

    return new CardFacade(
      addUseCase,
      updateUseCase,
      findTransactionsByCardIdUseCase,
    );
  }
}
