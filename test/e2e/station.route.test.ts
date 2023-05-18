import { spec } from 'pactum';

import { MySQLConnection } from '../../src/@core/@shared/infra/db/mysql-connection';
import { BASE_URL } from './util';
import { app, init } from '../../src/api/server/server';

describe('Station route', () => {
  const connection = MySQLConnection.getInstance();
  const url = `${BASE_URL}/stations`;

  beforeAll(() => {
    init();
  });

  afterAll(() => {
    app.close();
  });

  beforeEach(() => {
    const database = process.env.DB_DATABASE_TEST;

    connection.query(`TRUNCATE TABLE \`${database}\`.\`stations\``);
  });

  afterEach(() => {
    const database = process.env.DB_DATABASE_TEST;

    connection.query(`TRUNCATE TABLE \`${database}\`.\`stations\``);
  });

  describe('POST /stations', () => {
    it('should add a station', async () => {
      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'any_name',
          line: 'any_line',
        })
        .expectStatus(201);

      const stations = await connection.query('SELECT * FROM stations');

      expect(stations.length).toBe(1);
      expect(stations[0].id).toBeDefined();
      expect(stations[0].name).toBe('any_name');
      expect(stations[0].line).toBe('any_line');
    });
  });
});
