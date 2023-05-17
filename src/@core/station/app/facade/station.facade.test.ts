import { describe, expect, it } from 'vitest';

import { StationFacade } from './station.facade';
import { AddStationUseCase } from '../use-case/add/add-station.use-case';
import { StationInMemoryRepository } from '../../infra/repository/in-memory/station.in-memory.repository';
import { UniqueFieldException } from '../../../@shared/exception/unique-field.exception';
import { FindAllStationsUseCase } from '../use-case/find-all/find-all-stations.use-case';
import { FindStationByIdUseCase } from '../use-case/find-by-id/find-station-by-id.use-case';
import { NotFoundException } from '../../../@shared/exception/not-found.exception';
import { UpdateStationUseCase } from '../use-case/update/update-station.use-case';
import { RemoveStationUseCase } from '../use-case/remove/remove-station.use-case';
import { RemoveAllStationsUseCase } from '../use-case/remove-all/remove-all-stations.use-case';
import { RestoreAllStationUseCase } from '../use-case/restore-all/restore-all-station.use-case';

const makeSut = (): StationFacade => {
  const repository = new StationInMemoryRepository();

  const addUseCase = new AddStationUseCase(repository);
  const findAllUseCase = new FindAllStationsUseCase(repository);
  const findByIdUseCase = new FindStationByIdUseCase(repository);
  const updateUseCase = new UpdateStationUseCase(repository);
  const removeUseCase = new RemoveStationUseCase(repository);
  const removeAllUseCase = new RemoveAllStationsUseCase(repository);
  const restoreAllUseCase = new RestoreAllStationUseCase(repository);

  return new StationFacade(
    addUseCase,
    findAllUseCase,
    findByIdUseCase,
    updateUseCase,
    removeUseCase,
    removeAllUseCase,
    restoreAllUseCase,
  );
};

describe('StationFacade', () => {
  it('should add a station', async () => {
    const facade = makeSut();

    const input = {
      name: 'any_name',
      line: 'any_line',
    };

    await expect(async () => await facade.add(input)).not.toThrow();
  });

  it('should not add a station with the same name', async () => {
    const facade = makeSut();

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
    const facade = makeSut();

    await expect(async () => await facade.findAll()).not.toThrow();
  });

  it('should find a station by id', async () => {
    const facade = makeSut();

    await facade.add({ name: 'any_name', line: 'any_line' });

    await expect(async () => await facade.findById({ id: 1 })).not.toThrow();
  });

  it('should throw an error when not find a station by id', async () => {
    const facade = makeSut();

    await expect(async () => {
      await facade.findById({ id: 1 });
    }).rejects.toThrow(NotFoundException);
  });

  it('should update a station', async () => {
    const facade = makeSut();

    await facade.add({ name: 'any_name', line: 'any_line' });

    const input = {
      id: 1,
      name: 'any_name',
      line: 'any_line',
    };

    await expect(async () => await facade.update(input)).not.toThrow();
  });

  it('should throw an error when not find a station', async () => {
    const facade = makeSut();

    await expect(async () => {
      await facade.update({ id: 1, name: 'any_name', line: 'any_line' });
    }).rejects.toThrow(NotFoundException);
  });

  it('should not add a station with the same name', async () => {
    const facade = makeSut();

    await facade.add({
      name: 'unique_name',
      line: 'any_line1',
    });

    await facade.add({
      name: 'any_name2',
      line: 'any_line2',
    });

    const input = {
      id: 2,
      name: 'unique_name',
    };

    await expect(async () => {
      await facade.update(input);
    }).rejects.toThrow(UniqueFieldException);
  });

  it('should remove a station', async () => {
    const facade = makeSut();

    await facade.add({ name: 'any_name', line: 'any_line' });

    await expect(async () => await facade.remove({ id: 1 })).not.toThrow();
  });

  it('should throw an error when not find a station', async () => {
    const facade = makeSut();

    await expect(async () => {
      await facade.remove({ id: 1 });
    }).rejects.toThrow(NotFoundException);
  });

  it('should remove all stations', async () => {
    const facade = makeSut();

    await facade.add({ name: 'any_name', line: 'any_line' });

    await expect(async () => await facade.removeAll()).not.toThrow();
  });

  it('should restore all stations', async () => {
    const facade = makeSut();

    await facade.add({ name: 'any_name', line: 'any_line' });

    await facade.remove({
      id: 1,
    });

    await expect(async () => await facade.restoreAll()).not.toThrow();
  });
});
