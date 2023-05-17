import { describe, expect, it } from 'vitest';

import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { AddStationUseCase } from '../add/add-station.use-case';
import { RemoveStationUseCase } from './remove-station.use-case';
import { FindAllStationsUseCase } from '../find-all/find-all-stations.use-case';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';

const makeSut = () => {
  const repository = new StationInMemoryRepository();

  const addUseCase = new AddStationUseCase(repository);
  const findAllUseCase = new FindAllStationsUseCase(repository);
  const removeUseCase = new RemoveStationUseCase(repository);

  return {
    addUseCase,
    findAllUseCase,
    removeUseCase,
  };
};

describe('RemoveStationUseCase', () => {
  it('should remove a station', async () => {
    const { addUseCase, findAllUseCase, removeUseCase } = makeSut();

    const { id: insertedId } = await addUseCase.execute({
      name: 'any_name',
      line: 'any_line',
    });

    const { stations } = await findAllUseCase.execute();

    expect(stations).toHaveLength(1);
    expect(stations[0].id).toBe(insertedId);

    await removeUseCase.execute({
      id: insertedId,
    });

    const { stations: stationsAfterRemove } = await findAllUseCase.execute();

    expect(stationsAfterRemove).toHaveLength(0);
  });

  it('should throw an error if the station does not exist', async () => {
    const { removeUseCase } = makeSut();

    const input = { id: 1 };

    await expect(removeUseCase.execute(input)).rejects.toThrowError(
      new NotFoundException('Station', `Station with id ${input.id} not found`),
    );
  });
});
