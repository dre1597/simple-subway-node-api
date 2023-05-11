import { describe, expect, it } from 'vitest';

import { StationFacade } from './station.facade';
import { AddStationUseCase } from '../use-case/add/add-station.use-case';
import { StationInMemoryRepository } from '../infra/repository/in-memory/station.in-memory.repository';
import { UniqueFieldException } from '../../@shared/exception/unique-field.exception';
import { FindAllStationsUseCase } from '../use-case/find-all/find-all-stations.use-case';

describe('StationFacade', () => {
  it('should add a station', async () => {
    const repository = new StationInMemoryRepository();

    const addUseCase = new AddStationUseCase(repository);
    const findAllUseCase = new FindAllStationsUseCase(repository);

    const facade = new StationFacade(addUseCase, findAllUseCase);

    const input = {
      name: 'any_name',
      line: 'any_line',
    };

    await expect(async () => await facade.add(input)).not.toThrow();
  });

  it('should not add a station with the same name', async () => {
    const repository = new StationInMemoryRepository();

    const addUseCase = new AddStationUseCase(repository);
    const findAllUseCase = new FindAllStationsUseCase(repository);

    const facade = new StationFacade(addUseCase, findAllUseCase);

    const input = {
      name: 'any_name',
      line: 'any_line',
    };

    await facade.add(input);

    await expect(async () => {
      await facade.add(input);
    }).rejects.toThrow(UniqueFieldException);
  });

  it('should find all stations', async () => {
    const repository = new StationInMemoryRepository();

    const addUseCase = new AddStationUseCase(repository);
    const findAllUseCase = new FindAllStationsUseCase(repository);

    const facade = new StationFacade(addUseCase, findAllUseCase);

    await expect(async () => await facade.findAll()).not.toThrow();
  });
});
