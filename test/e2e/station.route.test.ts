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

    it('should throw 422 if the name is empty', async () => {
      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: '',
          line: 'any_line',
        })
        .expectStatus(422)
        .expectBody({
          message: 'name is a required field',
          error: 'ValidationError',
          statusCode: 422,
        });

      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: '    ',
          line: 'any_line',
        })
        .expectStatus(422)
        .expectBody({
          message: 'name is a required field',
          error: 'ValidationError',
          statusCode: 422,
        });
    });

    it('should throw 422 if the line is empty', async () => {
      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'any_name',
          line: '',
        })
        .expectStatus(422)
        .expectBody({
          message: 'line is a required field',
          error: 'ValidationError',
          statusCode: 422,
        });

      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'any_name',
          line: '      ',
        })
        .expectStatus(422)
        .expectBody({
          message: 'line is a required field',
          error: 'ValidationError',
          statusCode: 422,
        });
    });

    it('should throw 422 if the name is invalid', async () => {
      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'an',
          line: 'any_line',
        })
        .expectStatus(422)
        .expectBody({
          message: 'name must be at least 3 characters',
          error: 'ValidationError',
          statusCode: 422,
        });

      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: ''.padEnd(33, 'a'),
          line: 'any_line',
        })
        .expectStatus(422)
        .expectBody({
          message: 'name must be at most 32 characters',
          error: 'ValidationError',
          statusCode: 422,
        });
    });

    it('should throw 422 if the line is invalid', async () => {
      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'any_name',
          line: 'an',
        })
        .expectStatus(422)
        .expectBody({
          message: 'line must be at least 3 characters',
          error: 'ValidationError',
          statusCode: 422,
        });

      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'any_name',
          line: ''.padEnd(33, 'a'),
        })
        .expectStatus(422)
        .expectBody({
          message: 'line must be at most 32 characters',
          error: 'ValidationError',
          statusCode: 422,
        });
    });

    it('should return 409 if the station name already exists', async () => {
      await connection.query(
        'INSERT INTO stations (name, line) VALUES ("any_name", "any_line")',
      );

      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'any_name',
          line: 'any_line',
        })
        .expectStatus(409)
        .expectBody({
          message: 'Unique field: name, details: Name already exists',
          error: 'UniqueFieldException',
          statusCode: 409,
        });
    });
  });

  describe('GET /stations', () => {
    it('should list all stations', async () => {
      await connection.query(
        'INSERT INTO stations (name, line) VALUES ("any_name", "any_line")',
      );

      await spec()
        .get(url)
        .expectStatus(200)
        .expectJson([
          {
            id: 1,
            name: 'any_name',
            line: 'any_line',
          },
        ]);
    });

    it('should return an empty list if there is no stations', async () => {
      await spec().get(url).expectStatus(200).expectJson([]);
    });
  });

  describe('GET /stations/:id', () => {
    it('should find a station by id', async () => {
      await connection.query(
        'INSERT INTO stations (name, line) VALUES ("any_name", "any_line")',
      );

      await spec().get(`${url}/1`).expectStatus(200).expectJson({
        id: 1,
        name: 'any_name',
        line: 'any_line',
      });
    });

    it('should throw 404 if there is no station with the given id', async () => {
      await spec().get(`${url}/0`).expectStatus(404);
    });
  });
});
