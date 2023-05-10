import { describe, expect, it } from 'vitest';

import { StationInMemoryRepository } from './station.in-memory.repository';
import { Station } from '../../domain/station';

describe('StationInMemoryRepository', () => {
  it('should insert a station', async () => {
    const repository = new StationInMemoryRepository();

    const props = {
      name: 'any_name1',
      line: 'any_line1',
    };

    let station = new Station(props);

    let stationInserted = (
      await repository.insert({
        station,
      })
    ).station;

    expect(stationInserted.id).toBe(1);
    expect(stationInserted.name).toBe(props.name);
    expect(stationInserted.line).toBe(props.line);

    props.name = 'any_name2';
    props.line = 'any_line2';

    station = new Station(props);

    stationInserted = (
      await repository.insert({
        station,
      })
    ).station;

    expect(stationInserted.id).toBe(2);
    expect(stationInserted.name).toBe(props.name);
    expect(stationInserted.line).toBe(props.line);
  });
});
