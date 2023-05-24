import { spec } from 'pactum';
import { iso } from 'pactum-matchers';

import { MySQLConnection } from '../../src/@core/@shared/infra/db/mysql/mysql-connection';
import { app, init } from '../../src/api/server/server';
import { BASE_URL } from './util';

describe('Card route', () => {
  const connection = MySQLConnection.getInstance();
  const url = `${BASE_URL}/cards`;

  const truncateTables = async () => {
    const database = process.env.DB_DATABASE_TEST;

    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query(`TRUNCATE TABLE \`${database}\`.\`cards\``);
    await connection.query(`TRUNCATE TABLE \`${database}\`.\`transactions\``);
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  };

  beforeAll(async () => {
    await init();
  });

  afterAll(() => {
    app.close();
  });

  beforeEach(async () => {
    await truncateTables();
  });

  afterEach(async () => {
    await truncateTables();
  });

  describe('POST /cards', () => {
    it('should add a card', async () => {
      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'any_name',
          balance: 100,
        })
        .expectStatus(201);

      const cards = await connection.query('SELECT * FROM cards');

      expect(cards.length).toBe(1);
      expect(cards[0].id).toBeDefined();
      expect(cards[0].name).toBe('any_name');
      expect(cards[0].balance).toBe(100);
    });

    it('should throw 422 if the name is empty', async () => {
      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: '',
        })
        .expectStatus(422)
        .expectBody({
          statusCode: 422,
          error: 'ValidationError',
          message: 'name is a required field',
        });

      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: '  ',
        })
        .expectStatus(422)
        .expectBody({
          statusCode: 422,
          error: 'ValidationError',
          message: 'name is a required field',
        });
    });

    it('should throw 422 if the name is invalid', async () => {
      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'an',
        })
        .expectStatus(422)
        .expectBody({
          statusCode: 422,
          error: 'ValidationError',
          message: 'name must be at least 3 characters',
        });

      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'Lorem ipsum dolor sit amet proi consecteturn',
        })
        .expectStatus(422)
        .expectBody({
          statusCode: 422,
          error: 'ValidationError',
          message: 'name must be at most 32 characters',
        });
    });
  });

  describe('PATCH /cards/:id', () => {
    it('should update a card', async () => {
      await connection.query('INSERT INTO cards (name) VALUES ("any_name")');

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'updated_name',
          balance: 100,
        })
        .expectStatus(204);

      const cards = await connection.query('SELECT * FROM cards');

      expect(cards.length).toBe(1);
      expect(cards[0].name).toBe('updated_name');
      expect(cards[0].balance).toBe(100);
    });

    it('should throw 422 if the name is empty', async () => {
      await connection.query('INSERT INTO cards (name) VALUES ("any_name")');

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: '',
        })
        .expectStatus(422)
        .expectBody({
          statusCode: 422,
          error: 'ValidationError',
          message: 'name must be at least 3 characters',
        });

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: '     ',
        })
        .expectStatus(422)
        .expectBody({
          statusCode: 422,
          error: 'ValidationError',
          message: 'name must be at least 3 characters',
        });
    });

    it('should throw 422 if the name is invalid', async () => {
      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'an',
        })
        .expectStatus(422)
        .expectBody({
          statusCode: 422,
          error: 'ValidationError',
          message: 'name must be at least 3 characters',
        });

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'Lorem ipsum dolor sit amet proi consecteturn',
        })
        .expectStatus(422)
        .expectBody({
          statusCode: 422,
          error: 'ValidationError',
          message: 'name must be at most 32 characters',
        });
    });
  });

  describe('GET /cards/:id/transactions', () => {
    it('should get a card transactions', async () => {
      await connection.query('INSERT INTO cards (name) VALUES ("any_name")');

      await connection.query('UPDATE cards SET balance = 1000 WHERE id = 1');

      await spec()
        .get(`${url}/1/transactions`)
        .expectStatus(200)
        .expectJsonMatch([
          {
            id: 1,
            amount: 1000,
            timestamp: iso(),
            card: {
              id: 1,
              balance: 1000,
              name: 'any_name',
            },
          },
        ]);
    });
  });
});
