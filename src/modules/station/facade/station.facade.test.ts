import { describe, expect, it } from 'vitest';

import { StationFacade } from './station.facade';
import { AddStationUseCase } from '../use-case/add/add-station.use-case';
import { StationInMemoryRepository } from '../infra/repository/in-memory/station.in-memory.repository';
import { UniqueFieldException } from '../../@shared/exception/unique-field.exception';
import { FindAllStationsUseCase } from '../use-case/find-all/find-all-stations.use-case';
import { FindStationByIdUseCase } from '../use-case/find-by-id/find-station-by-id.use-case';
import { NotFoundException } from '../../@shared/exception/not-found.exception';

const makeSut = (): StationFacade => {
  const repository = new StationInMemoryRepository();

  const addUseCase = new AddStationUseCase(repository);
  const findAllUseCase = new FindAllStationsUseCase(repository);
  const findByIdUseCase = new FindStationByIdUseCase(repository);

  return new StationFacade(addUseCase, findAllUseCase, findByIdUseCase);
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

  it('should throw an error when find a station by id', async () => {
    const facade = makeSut();

    await expect(async () => {
      await facade.findById({ id: 1 });
    }).rejects.toThrow(NotFoundException);
  });
});
