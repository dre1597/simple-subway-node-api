import { describe, expect, it } from 'vitest';

import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { Station } from '../../../domain/station';
import { RestoreAllStationUseCase } from './restore-all-station.use-case';

const makeSut = () => {
  const repository = new StationInMemoryRepository();

  const restoreAllUseCase = new RestoreAllStationUseCase(repository);

  return {
    restoreAllUseCase,
    repository,
  };
};

describe('RestoreAllStationsUseCase', () => {
  it('should restore all stations', async () => {
    const { restoreAllUseCase, repository } = makeSut();

    await repository.save({
      station: new Station({
        name: 'any_name1',
        line: 'any_line1',
        isDeleted: true,
      }),
    });

    await repository.save({
      station: new Station({
        name: 'any_name2',
        line: 'any_line2',
        isDeleted: true,
      }),
    });

    await restoreAllUseCase.execute();

    const { stations } = await repository.findAll();

    expect(stations).toHaveLength(2);
  });
});
