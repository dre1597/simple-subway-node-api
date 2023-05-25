import { spec } from 'pactum';

import { MySQLConnection } from '../../src/@core/@shared/infra/db/mysql/mysql-connection';
import { BASE_URL } from './util';
import { app, init } from '../../src/api/server/server';
import {
  MAX_STATION_LINE_LENGTH,
  MAX_STATION_NAME_LENGTH,
  MIN_STATION_LINE_LENGTH,
  MIN_STATION_NAME_LENGTH,
} from '../../src/@core/station/domain/station';

describe('Station route', () => {
  const connection = MySQLConnection.getInstance();
  const url = `${BASE_URL}/stations`;

  const truncateTable = async () => {
    const database = process.env.DB_DATABASE_TEST;

    await connection.query(`TRUNCATE TABLE \`${database}\`.\`stations\``);
  };

  beforeAll(async () => {
    await init();
  });

  afterAll(() => {
    app.close();
  });

  beforeEach(async () => {
    await truncateTable();
  });

  afterEach(async () => {
    await truncateTable();
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
          message: `name must be at least ${MIN_STATION_NAME_LENGTH} characters`,
          error: 'ValidationError',
          statusCode: 422,
        });

      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: ''.padEnd(MAX_STATION_NAME_LENGTH + 1, 'a'),
          line: 'any_line',
        })
        .expectStatus(422)
        .expectBody({
          message: `name must be at most ${MAX_STATION_NAME_LENGTH} characters`,
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
          message: `line must be at least ${MIN_STATION_LINE_LENGTH} characters`,
          error: 'ValidationError',
          statusCode: 422,
        });

      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'any_name',
          line: ''.padEnd(MAX_STATION_LINE_LENGTH + 1, 'a'),
        })
        .expectStatus(422)
        .expectBody({
          message: `line must be at most ${MAX_STATION_LINE_LENGTH} characters`,
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

  describe('PATCH /stations/:id', () => {
    it('should update a station', async () => {
      await connection.query(
        'INSERT INTO stations (name, line) VALUES ("any_name", "any_line")',
      );

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'updated_name',
          line: 'updated_line',
        })
        .expectStatus(204);

      let stations = await connection.query('SELECT * FROM stations');

      expect(stations.length).toBe(1);
      expect(stations[0].name).toBe('updated_name');
      expect(stations[0].line).toBe('updated_line');

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'updated_name',
        })
        .expectStatus(204);

      stations = await connection.query('SELECT * FROM stations');

      expect(stations.length).toBe(1);
      expect(stations[0].name).toBe('updated_name');
      expect(stations[0].line).toBe('updated_line');

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          line: 'updated_line',
        })
        .expectStatus(204);

      stations = await connection.query('SELECT * FROM stations');

      expect(stations.length).toBe(1);
      expect(stations[0].name).toBe('updated_name');
      expect(stations[0].line).toBe('updated_line');
    });

    it('should throw 404 if there is no station with the given id', async () => {
      await spec()
        .patch(`${url}/1`)
        .withBody({
          name: 'updated_name',
          line: 'updated_line',
        })
        .expectStatus(404);
    });

    it('should throw 422 if the name is invalid', async () => {
      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'an',
          line: 'any_line',
        })
        .expectStatus(422)
        .expectBody({
          message: `name must be at least ${MIN_STATION_NAME_LENGTH} characters`,
          error: 'ValidationError',
          statusCode: 422,
        });

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: ''.padEnd(MAX_STATION_NAME_LENGTH + 1, 'a'),
          line: 'any_line',
        })
        .expectStatus(422)
        .expectBody({
          message: `name must be at most ${MAX_STATION_NAME_LENGTH} characters`,
          error: 'ValidationError',
          statusCode: 422,
        });
    });

    it('should throw 422 if the line is invalid', async () => {
      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'any_name',
          line: 'an',
        })
        .expectStatus(422)
        .expectBody({
          message: `line must be at least ${MIN_STATION_LINE_LENGTH} characters`,
          error: 'ValidationError',
          statusCode: 422,
        });

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'any_name',
          line: ''.padEnd(MAX_STATION_LINE_LENGTH + 1, 'a'),
        })
        .expectStatus(422)
        .expectBody({
          message: `line must be at most ${MAX_STATION_LINE_LENGTH} characters`,
          error: 'ValidationError',
          statusCode: 422,
        });
    });

    it('should return 409 if other station with the same name already exists', async () => {
      await connection.query(
        'INSERT INTO stations (name, line) VALUES ("unique_name", "any_line1")',
      );

      await connection.query(
        'INSERT INTO stations (name, line) VALUES ("any_name2", "any_line2")',
      );

      await spec()
        .patch(`${url}/2`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'unique_name',
          line: 'updated_line',
        })
        .expectStatus(409)
        .expectBody({
          message: 'Unique field: name, details: Name already exists',
          error: 'UniqueFieldException',
          statusCode: 409,
        });
    });

    it('should not return 409 when updating a station with the same data', async () => {
      await connection.query(
        'INSERT INTO stations (name, line) VALUES ("any_name", "any_line")',
      );

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'any_name',
          line: 'any_line',
        })
        .expectStatus(204);
    });
  });

  describe('DELETE /stations/:id', () => {
    it('should delete a station', async () => {
      await connection.query(
        'INSERT INTO stations (name, line) VALUES ("any_name", "any_line")',
      );

      await spec().delete(`${url}/1`).expectStatus(204);

      const currentStations = await connection.query(
        'SELECT * FROM current_stations',
      );

      expect(currentStations).toHaveLength(0);

      const allStations = await connection.query('SELECT * FROM stations');

      expect(allStations).toHaveLength(1);
      expect(allStations[0].name).toBe('any_name');
      expect(allStations[0].line).toBe('any_line');
      expect(allStations[0].is_deleted).toBe(1);
    });

    it('should throw 404 if there is no station with the given id', async () => {
      await spec().delete(`${url}/0`).expectStatus(404);
    });
  });

  describe('DELETE /all', () => {
    it('should delete all stations', async () => {
      await connection.query(
        'INSERT INTO stations (name, line) VALUES ("any_name1", "any_line1")',
      );
      await connection.query(
        'INSERT INTO stations (name, line) VALUES ("any_name2", "any_line2")',
      );

      await spec().delete(`${url}/all`).expectStatus(204);

      const allStations = await connection.query('SELECT * FROM stations');

      expect(allStations).toHaveLength(2);
      expect(allStations[0].name).toBe('any_name1');
      expect(allStations[0].line).toBe('any_line1');
      expect(allStations[0].is_deleted).toBe(1);
      expect(allStations[1].name).toBe('any_name2');
      expect(allStations[1].line).toBe('any_line2');
      expect(allStations[1].is_deleted).toBe(1);
    });
  });

  describe('PUT /all', () => {
    it('should update all stations', async () => {
      await connection.query(
        'INSERT INTO stations (name, line, is_deleted) VALUES ("any_name1", "any_line1", 1)',
      );
      await connection.query(
        'INSERT INTO stations (name, line, is_deleted) VALUES ("any_name2", "any_line2", 1)',
      );

      await spec().put(`${url}/all`).expectStatus(204);

      const allStations = await connection.query('SELECT * FROM stations');

      expect(allStations).toHaveLength(2);
      expect(allStations[0].name).toBe('any_name1');
      expect(allStations[0].line).toBe('any_line1');
      expect(allStations[0].is_deleted).toBe(0);
      expect(allStations[1].name).toBe('any_name2');
      expect(allStations[1].line).toBe('any_line2');
      expect(allStations[1].is_deleted).toBe(0);
    });
  });
});
