import { describe, expect, it } from 'vitest';
import { StationFacade } from './station.facade';
import { AddStationUseCase } from '../use-case/add-station.use-case';
import { StationInMemoryRepository } from '../infra/repository/in-memory/station.in-memory.repository';

describe('StationFacade', () => {
  it('should add a station', () => {
    const repository = new StationInMemoryRepository();

    const useCase = new AddStationUseCase(repository);

    const facade = new StationFacade(useCase);

    const input = {
      name: 'any_name',
      line: 'any_line',
    };

    expect(() => facade.add(input)).not.toThrow();
  });
});
