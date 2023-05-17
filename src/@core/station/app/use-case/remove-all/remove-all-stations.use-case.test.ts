import { describe, expect, it } from 'vitest';

import { RemoveAllStationsUseCase } from './remove-all-stations.use-case';
import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { Station } from '../../../domain/station';

const makeSut = () => {
  const repository = new StationInMemoryRepository();

  const removeAllUseCase = new RemoveAllStationsUseCase(repository);

  return {
    removeAllUseCase,
    repository,
  };
};

describe('RemoveAllStationsUseCase', () => {
  it('should remove all stations', async () => {
    const { removeAllUseCase, repository } = makeSut();

    await repository.save({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
      }),
    });

    await repository.save({
      station: new Station({
        name: 'any_name2',
        line: 'any_line2',
      }),
    });

    await removeAllUseCase.execute();

    const { stations } = await repository.findAll();

    expect(stations).toHaveLength(0);
  });
});
