import { afterAll, beforeAll, describe, it } from 'vitest';
import { spec } from 'pactum';

import { app, init } from '../../src/api/server/server';
import { BASE_URL } from './util';

describe('Hello route', () => {
  const url = `${BASE_URL}/`;

  beforeAll(() => {
    init();
  });

  afterAll(() => {
    app.close();
  });

  it('should return hello world', async () => {
    await spec().get(url).expectStatus(200).expectBody({
      hello: 'world',
    });
  });
});
