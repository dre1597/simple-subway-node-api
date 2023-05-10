import { describe, expect, it } from 'vitest';
import { StationInMemoryRepository } from '../../infra/repository/in-memory/station.in-memory.repository';
import {
  CreateStationInputDto,
  CreateStationUseCase,
} from './create-station.use-case';

describe('CreateStationUseCase', () => {
  it('should create a station', async () => {
    const repository = new StationInMemoryRepository();
    const useCase = new CreateStationUseCase(repository);

    const input: CreateStationInputDto = {
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
