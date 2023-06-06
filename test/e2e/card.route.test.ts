import { spec } from 'pactum';
import { iso } from 'pactum-matchers';

import { app, init } from '#api/server/server';
import { MAX_CARD_NAME_LENGTH, MIN_CARD_NAME_LENGTH } from '#card/domain/card';
import { setupMySQL } from '#core/@seedwork/infra/testing/helpers/db';
import { HttpStatusCode } from '#shared/utils/http-status-code.enum';

import { BASE_URL } from './util';

describe('Card route', () => {
  const connection = setupMySQL('cards').connection;
  const url = `${BASE_URL}/cards`;

  beforeAll(async () => {
    await init();
  });

  afterAll(() => {
    app.close();
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
        .expectStatus(HttpStatusCode.CREATED);

      const cards = await connection.query('SELECT * FROM cards');

      expect(cards.length).toBe(1);
      expect(cards[0].id).toBeDefined();
      expect(cards[0].name).toBe('any_name');
      expect(cards[0].balance).toBe(100);
    });

    it('should throw validation error if the name is empty', async () => {
      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: '',
        })
        .expectStatus(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .expectBody({
          statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
          error: 'ValidationError',
          message: 'name is a required field',
        });

      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: '  ',
        })
        .expectStatus(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .expectBody({
          statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
          error: 'ValidationError',
          message: 'name is a required field',
        });
    });

    it('should throw validation error if the name is invalid', async () => {
      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'an',
        })
        .expectStatus(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .expectBody({
          statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
          error: 'ValidationError',
          message: `name must be at least ${MIN_CARD_NAME_LENGTH} characters`,
        });

      await spec()
        .post(url)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'Lorem ipsum dolor sit amet proi consecteturn',
        })
        .expectStatus(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .expectBody({
          statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
          error: 'ValidationError',
          message: `name must be at most ${MAX_CARD_NAME_LENGTH} characters`,
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
        .expectStatus(HttpStatusCode.NO_CONTENT);

      const cards = await connection.query('SELECT * FROM cards');

      expect(cards.length).toBe(1);
      expect(cards[0].name).toBe('updated_name');
      expect(cards[0].balance).toBe(100);
    });

    it('should throw validation error if the name is empty', async () => {
      await connection.query('INSERT INTO cards (name) VALUES ("any_name")');

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: '',
        })
        .expectStatus(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .expectBody({
          statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
          error: 'ValidationError',
          message: `name must be at least ${MIN_CARD_NAME_LENGTH} characters`,
        });

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: '     ',
        })
        .expectStatus(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .expectBody({
          statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
          error: 'ValidationError',
          message: `name must be at least ${MIN_CARD_NAME_LENGTH} characters`,
        });
    });

    it('should throw validation error if the name is invalid', async () => {
      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'an',
        })
        .expectStatus(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .expectBody({
          statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
          error: 'ValidationError',
          message: `name must be at least ${MIN_CARD_NAME_LENGTH} characters`,
        });

      await spec()
        .patch(`${url}/1`)
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          name: 'Lorem ipsum dolor sit amet proi consecteturn',
        })
        .expectStatus(HttpStatusCode.UNPROCESSABLE_ENTITY)
        .expectBody({
          statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
          error: 'ValidationError',
          message: `name must be at most ${MAX_CARD_NAME_LENGTH} characters`,
        });
    });
  });

  describe('GET /cards/:id/transactions', () => {
    it('should get a card transactions', async () => {
      await connection.query('INSERT INTO cards (name) VALUES ("any_name")');

      await connection.query('UPDATE cards SET balance = 1000 WHERE id = 1');

      await spec()
        .get(`${url}/1/transactions`)
        .expectStatus(HttpStatusCode.OK)
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
