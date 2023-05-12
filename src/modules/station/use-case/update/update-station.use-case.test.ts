import { describe, expect, it } from 'vitest';
import { StationInMemoryRepository } from '../../infra/repository/in-memory/station.in-memory.repository';
import { AddStationUseCase } from '../add/add-station.use-case';
import { UpdateStationUseCase } from './update-station.use-case';
import { UpdateStationUseCaseInputDto } from './update-station.use-case.dto';
import { NotFoundException } from '../../../@shared/exception/not-found.exception';
import { UniqueFieldException } from '../../../@shared/exception/unique-field.exception';

const makeSut = () => {
  const repository = new StationInMemoryRepository();
  const addUseCase = new AddStationUseCase(repository);
  const updateUseCase = new UpdateStationUseCase(repository);

  return {
    addUseCase,
    updateUseCase,
  };
};

describe('UpdateStationUseCase', () => {
  it('should update a station', async () => {
    const { addUseCase, updateUseCase } = makeSut();

    const { id: insertedId } = await addUseCase.execute({
      name: 'any_name',
      line: 'any_line',
    });

    const input: UpdateStationUseCaseInputDto = {
      id: insertedId,
      name: 'updated_name',
      line: 'updated_line',
    };

    const output = await updateUseCase.execute(input);

    expect(output.id).toBe(input.id);
    expect(output.name).toBe(input.name);
    expect(output.line).toBe(input.line);
  });

  it('should keep the name if its not present', async () => {
    const { addUseCase, updateUseCase } = makeSut();

    const addInput = {
      name: 'any_name',
      line: 'any_line',
    };

    const { id: insertedId } = await addUseCase.execute(addInput);

    const updateInput: UpdateStationUseCaseInputDto = {
      id: insertedId,
      line: 'updated_line',
    };

    const output = await updateUseCase.execute(updateInput);

    expect(output.id).toBe(updateInput.id);
    expect(output.name).toBe(addInput.name);
    expect(output.line).toBe(updateInput.line);
  });

  it('should keep the line if its not present', async () => {
    const { addUseCase, updateUseCase } = makeSut();

    const addInput = {
      name: 'any_name',
      line: 'any_line',
    };

    const { id: insertedId } = await addUseCase.execute(addInput);

    const updateInput: UpdateStationUseCaseInputDto = {
      id: insertedId,
      name: 'updated_name',
    };

    const output = await updateUseCase.execute(updateInput);

    expect(output.id).toBe(updateInput.id);
    expect(output.name).toBe(updateInput.name);
    expect(output.line).toBe(addInput.line);
  });

  it('should throws NotFoundException if there is no station', async () => {
    const { updateUseCase } = makeSut();

    const input: UpdateStationUseCaseInputDto = {
      id: 1,
      name: 'updated_name',
      line: 'updated_line',
    };

    await expect(async () => {
      await updateUseCase.execute(input);
    }).rejects.toThrow(
      new NotFoundException('Station', `Station with id ${input.id} not found`),
    );
  });

  it('should throws UniqueFieldException if there is a station with the same name', async () => {
    const { addUseCase, updateUseCase } = makeSut();

    await addUseCase.execute({
      name: 'unique_name',
      line: 'any_line2',
    });

    const { id: insertedId } = await addUseCase.execute({
      name: 'any_name2',
      line: 'any_line2',
    });

    const input: UpdateStationUseCaseInputDto = {
      id: insertedId,
      name: 'unique_name',
      line: 'updated_line',
    };

    await expect(async () => {
      await updateUseCase.execute(input);
    }).rejects.toThrow(new UniqueFieldException('name', 'Name already exists'));
  });
});
