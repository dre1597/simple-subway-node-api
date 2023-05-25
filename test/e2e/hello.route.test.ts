import { spec } from 'pactum';

import { app, init } from '../../src/api/server/server';
import { BASE_URL } from './util';
import { HttpStatusCode } from '../../src/@core/@shared/utils/http-status-code.enum';

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
