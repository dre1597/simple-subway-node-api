import { spec } from 'pactum';

import { MySQLConnection } from '../../src/@core/@shared/infra/db/mysql-connection';
import { app, init } from '../../src/api/server/server';

describe('Card route', () => {
  const connection = MySQLConnection.getInstance();

  beforeAll(() => {
    init();
  });

  afterAll(() => {
    app.close();
  });

  beforeEach(() => {
    const database = process.env.DB_DATABASE_TEST;

    connection.query('SET FOREIGN_KEY_CHECKS = 0');
    connection.query(`TRUNCATE TABLE \`${database}\`.\`cards\``);
    connection.query(`TRUNCATE TABLE \`${database}\`.\`transactions\``);
    connection.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  afterEach(() => {
    const database = process.env.DB_DATABASE_TEST;

    connection.query('SET FOREIGN_KEY_CHECKS = 0');
    connection.query(`TRUNCATE TABLE \`${database}\`.\`cards\``);
    connection.query(`TRUNCATE TABLE \`${database}\`.\`transactions\``);
    connection.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  describe('POST /cards', () => {
    it('should add a card', async () => {
      await spec()
        .post('http://localhost:3000/cards')
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'any_name',
        })
        .expectStatus(201);

      const cards = await connection.query('SELECT * FROM cards');

      expect(cards.length).toBe(1);
      expect(cards[0].id).toBeDefined();
      expect(cards[0].name).toBe('any_name');
    });

    it('should throw 422 if the name is empty', async () => {
      await spec()
        .post('http://localhost:3000/cards')
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
        .post('http://localhost:3000/cards')
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
        .post('http://localhost:3000/cards')
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
        .post('http://localhost:3000/cards')
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

  describe('PUT /cards/:id', () => {
    it('should update a card', async () => {
      await connection.query('INSERT INTO cards (name) VALUES ("any_name")');

      await spec()
        .put('http://localhost:3000/cards/1')
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'updated_name',
        })
        .expectStatus(204);

      const cards = await connection.query('SELECT * FROM cards');

      expect(cards.length).toBe(1);
      expect(cards[0].name).toBe('updated_name');
    });

    it('should throw 422 if the name is empty', async () => {
      await connection.query('INSERT INTO cards (name) VALUES ("any_name")');

      await spec()
        .put('http://localhost:3000/cards/1')
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
        .put('http://localhost:3000/cards/1')
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
        .put('http://localhost:3000/cards/1')
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
        .put('http://localhost:3000/cards/1')
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
});
