import { describe, expect, it } from 'vitest';

import { StationInMemoryRepository } from '../../infra/repository/in-memory/station.in-memory.repository';
import { AddStationUseCase } from './add-station.use-case';
import { AddStationUseCaseInputDto } from './add-station.use-case.dto';
import { UniqueFieldException } from '../../../@shared/exception/unique-field.exception';
import { InvalidFieldException } from '../../../@shared/exception/invalid-field.exception';

const makeSut = () => {
  const repository = new StationInMemoryRepository();
  return new AddStationUseCase(repository);
};

describe('AddStationUseCase', () => {
  it('should add a station', async () => {
    const useCase = makeSut();

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

  it('should throws InvalidFieldException if entity throws', async () => {
    const useCase = makeSut();

    const input: AddStationUseCaseInputDto = {
      name: '',
      line: 'any_line',
    };

    await expect(async () => {
      await useCase.execute(input);
    }).rejects.toThrow(
      new InvalidFieldException(
        'name',
        'Name must be between 3 and 32 characters long',
      ),
    );
  });

  it('should not add a station with a invalid line', async () => {
    const useCase = makeSut();

    const input: AddStationUseCaseInputDto = {
      name: 'any_name',
      line: '',
    };

    await expect(async () => {
      await useCase.execute(input);
    }).rejects.toThrow(
      new InvalidFieldException(
        'line',
        'Line must be between 3 and 32 characters long',
      ),
    );
  });

  it("should not add a station with the same name'", async () => {
    const useCase = makeSut();

    const input: AddStationUseCaseInputDto = {
      name: 'any_name',
      line: 'any_line',
    };

    await useCase.execute(input);

    await expect(async () => {
      await useCase.execute(input);
    }).rejects.toThrow(new UniqueFieldException('name', 'Name already exists'));
  });
});
