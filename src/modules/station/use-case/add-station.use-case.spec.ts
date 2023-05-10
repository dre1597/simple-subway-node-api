import { describe, expect, it } from 'vitest';

import { StationInMemoryRepository } from '../infra/repository/in-memory/station.in-memory.repository';
import { AddStationUseCase } from './add-station.use-case';
import { AddStationUseCaseInputDto } from './add-station.use-case.dto';

describe('CreateStationUseCase', () => {
  it('should create a station', async () => {
    const repository = new StationInMemoryRepository();
    const useCase = new AddStationUseCase(repository);

    const input: AddStationUseCaseInputDto = {
      name: 'any_name',
      line: 'any_line',
    };

    const output = await useCase.execute(input);

    expect(output).toEqual({
      id: 1,
      name: 'any_name',
      line: 'any_line',
    });
  });
});
