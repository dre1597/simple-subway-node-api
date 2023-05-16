import { describe, expect, it } from 'vitest';

import { CardFacadeFactory } from './card.facade.factory';
import { CardMySQLRepository } from '../../infra/repository/mysql/card.mysql.repository';
import { CardInMemoryRepository } from '../../infra/repository/in-memory/card.in-memory.repository';
import { InvalidRepositoryVendorException } from '../../../@shared/exception/invalid-repository-vendor.exception';

describe('CardFacade', () => {
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

  it('should throw an error when vendor is not supported', async () => {
    await expect(async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore invalid union type needed
      await CardFacadeFactory.create('INVALID_VENDOR');
    }).rejects.toThrow(new InvalidRepositoryVendorException());
  });
});
