import { InvalidRepositoryVendorException } from '#shared/domain/exception/invalid-repository-vendor.exception';

import { CardInMemoryRepository } from '../../infra/repository/in-memory/card.in-memory.repository';
import { CardMongoRepository } from '../../infra/repository/mongo/card.mongo.repository';
import { CardMySQLRepository } from '../../infra/repository/mysql/card.mysql.repository';
import { CardFacadeFactory } from './card.facade.factory';

describe('CardFacade', () => {
  it('should create a card with in memory repository vendor', async () => {
    const facade = CardFacadeFactory.create('IN_MEMORY');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._addUseCase.cardRepository).toBeInstanceOf(
      CardInMemoryRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._updateUseCase.cardRepository).toBeInstanceOf(
      CardInMemoryRepository,
    );

    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore private property
      facade._findTransactionsByCardIdUseCase.cardRepository,
    ).toBeInstanceOf(CardInMemoryRepository);
  });

  it('should create a card with mysql repository vendor', async () => {
    const facade = CardFacadeFactory.create('MYSQL');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._addUseCase.cardRepository).toBeInstanceOf(
      CardMySQLRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._updateUseCase.cardRepository).toBeInstanceOf(
      CardMySQLRepository,
    );

    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore private property
      facade._findTransactionsByCardIdUseCase.cardRepository,
    ).toBeInstanceOf(CardMySQLRepository);
  });

  it('should create a card with mongodb repository vendor', async () => {
    const facade = CardFacadeFactory.create('MONGO');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._addUseCase.cardRepository).toBeInstanceOf(
      CardMongoRepository,
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore private property
    expect(facade._updateUseCase.cardRepository).toBeInstanceOf(
      CardMongoRepository,
    );

    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore private property
      facade._findTransactionsByCardIdUseCase.cardRepository,
    ).toBeInstanceOf(CardMongoRepository);
  });

  it('should throw an error when vendor is not supported', async () => {
    await expect(async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore invalid union type needed
      await CardFacadeFactory.create('INVALID_VENDOR');
    }).rejects.toThrow(new InvalidRepositoryVendorException());
  });
});
