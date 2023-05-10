import { describe, expect, it } from 'vitest';

import { StationInMemoryRepository } from '../../infra/repository/in-memory/station.in-memory.repository';
import { AddStationUseCase } from './add-station.use-case';
import { AddStationUseCaseInputDto } from './add-station.use-case.dto';
import { UniqueFieldException } from '../../../@shared/exception/domain/unique-field.exception';

describe('AddStationUseCase', () => {
  it('should add a station', async () => {
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

  it("should not insert a station with the same name'", async () => {
    const repository = new StationInMemoryRepository();
    const useCase = new AddStationUseCase(repository);

    const input: AddStationUseCaseInputDto = {
      name: 'any_name',
      line: 'any_line',
    };

    await useCase.execute(input);

    try {
      await useCase.execute(input);
    } catch (error) {
      expect(error).toBeInstanceOf(UniqueFieldException);
      expect(error.message).toBe(
        'Unique field: name, details: Name already exists',
      );
    }
  });
});
