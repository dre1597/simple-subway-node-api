import { describe, expect, it } from 'vitest';

import { StationInMemoryRepository } from '../../infra/repository/in-memory/station.in-memory.repository';
import { FindAllStationsUseCase } from './find-all-stations.use-case';
import { AddStationUseCase } from '../add/add-station.use-case';

describe('FindAllStationsUseCase', () => {
  it('should find all stations', async () => {
    const repository = new StationInMemoryRepository();

    const addUseCase = new AddStationUseCase(repository);

    await addUseCase.execute({
      name: 'any_name1',
      line: 'any_line1',
    });

    await addUseCase.execute({
      name: 'any_name2',
      line: 'any_line2',
    });

    const findAllUseCase = new FindAllStationsUseCase(repository);

    const output = await findAllUseCase.execute();

    expect(output).toEqual({
      stations: [
        {
          id: 1,
          name: 'any_name1',
          line: 'any_line1',
        },
        {
          id: 2,
          name: 'any_name2',
          line: 'any_line2',
        },
      ],
    });
  });

  it('should return an empty array if there is not stations', async () => {
    const repository = new StationInMemoryRepository();

    const useCase = new FindAllStationsUseCase(repository);

    const output = await useCase.execute();

    expect(output.stations).toEqual([]);
  });
});
