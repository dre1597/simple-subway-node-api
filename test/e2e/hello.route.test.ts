import { spec } from 'pactum';

import { app, init } from '#api/server/server';
import { HttpStatusCode } from '#shared/app/utils/http-status-code.enum';

import { BASE_URL } from './util';

describe('Hello route', () => {
  const url = `${BASE_URL}/`;

  beforeAll(async () => {
    await init();
  });

  afterAll(() => {
    app.close();
  });

  it('should return hello world', async () => {
    await spec().get(url).expectStatus(HttpStatusCode.OK).expectBody({
      hello: 'world',
    });
  });
});
