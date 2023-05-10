import { describe, expect, it } from 'vitest';

import { StationFacade } from './station.facade';
import { AddStationUseCase } from '../use-case/add-station.use-case';
import { StationInMemoryRepository } from '../infra/repository/in-memory/station.in-memory.repository';
import { UniqueFieldException } from '../../@shared/exception/domain/unique-field.exception';

describe('StationFacade', () => {
  it('should add a station', async () => {
    const repository = new StationInMemoryRepository();

    const useCase = new AddStationUseCase(repository);

    const facade = new StationFacade(useCase);

    const input = {
      name: 'any_name',
      line: 'any_line',
    };

    await expect(async () => await facade.add(input)).not.toThrow();
  });

  it('should not add a station with the same name', async () => {
    const repository = new StationInMemoryRepository();

    const useCase = new AddStationUseCase(repository);

    const facade = new StationFacade(useCase);

    const input = {
      name: 'any_name',
      line: 'any_line',
    };

    await facade.add(input);
    try {
      await facade.add(input);
    } catch (error) {
      expect(error).toBeInstanceOf(UniqueFieldException);
    }
  });
});
