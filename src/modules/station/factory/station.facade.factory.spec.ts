import { describe, expect, it } from 'vitest';

import { StationFacadeFactory } from './station.facade.factory';
import { StationFacade } from '../facade/station.facade';

describe('StationFacade', () => {
  it('should create a station facade', () => {
    const facade = StationFacadeFactory.create();

    expect(facade).toBeInstanceOf(StationFacade);
  });
});
