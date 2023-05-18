import { afterAll, beforeAll, describe, it } from 'vitest';
import { spec } from 'pactum';
import { app, init } from '../../src/api/server/server';

describe('Hello route', () => {
  beforeAll(() => {
    init();
  });

  afterAll(() => {
    app.close();
  });

  it('should return hello world', async () => {
    await spec().get('http://localhost:3000/').expectStatus(200).expectBody({
      hello: 'world',
    });
  });
});
