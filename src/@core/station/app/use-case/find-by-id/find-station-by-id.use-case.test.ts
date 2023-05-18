import { StationInMemoryRepository } from '../../../infra/repository/in-memory/station.in-memory.repository';
import { AddStationUseCase } from '../add/add-station.use-case';
import { FindStationByIdUseCase } from './find-station-by-id.use-case';
import { NotFoundException } from '../../../../@shared/exception/not-found.exception';
import { FindAllStationsUseCase } from '../find-all/find-all-stations.use-case';

const makeSut = () => {
  const repository = new StationInMemoryRepository();
  const addUseCase = new AddStationUseCase(repository);
  const findByIdUseCase = new FindStationByIdUseCase(repository);

  return {
    addUseCase,
    findByIdUseCase,
  };
};

describe('FindAllStationsUseCase', () => {
  it('should find all stations', async () => {
    const { addUseCase, findByIdUseCase } = makeSut();

    await addUseCase.execute({
      name: 'any_name1',
      line: 'any_line1',
    });

    const output = await findByIdUseCase.execute({
      id: 1,
    });

    expect(output).toEqual({
      station: {
        id: 1,
        name: 'any_name1',
        line: 'any_line1',
      },
    });
  });

  it('should throw an error if station not found', async () => {
    const { findByIdUseCase } = makeSut();

    const input = { id: 1 };

    await expect(async () => {
      await findByIdUseCase.execute(input);
    }).rejects.toThrowError(
      new NotFoundException('Station', `Station with id ${input.id} not found`),
    );
  });
});
