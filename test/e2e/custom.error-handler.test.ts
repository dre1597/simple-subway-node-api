import fastify from 'fastify';

import { customErrorHandler } from '../../src/api/server/custom.error-handler';
import { ValidationError } from 'yup';
import { CustomException } from '../../src/@core/@shared/exception/custom.exception';
import { spec } from 'pactum';

describe('CustomErrorHandler', () => {
  const app = fastify();
  const url = 'http://localhost:3001';

  beforeAll(async () => {
    app.setErrorHandler(customErrorHandler());

    app.route({
      url: '/validation-error',
      method: 'GET',
      handler: () => {
        throw new ValidationError('any_error');
      },
    });

    app.route({
      url: '/custom-exception',
      method: 'GET',
      handler: () => {
        throw new CustomException(400, 'any_name', 'any_message');
      },
    });

    app.route({
      url: '/internal-error',
      method: 'GET',
      handler: () => {
        throw new Error();
      },
    });

    await app.listen({ port: 3001 });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should throw a ValidationError if the route throws', async () => {
    await spec().get(`${url}/validation-error`).expectStatus(422).expectBody({
      statusCode: 422,
      error: 'ValidationError',
      message: 'any_error',
    });
  });

  it('should throw a CustomException if the route throws', async () => {
    await spec().get(`${url}/custom-exception`).expectStatus(400).expectBody({
      statusCode: 400,
      error: 'any_name',
      message: 'any_message',
    });
  });

  it('should throw a InternalServerErrorException if the route throws', async () => {
    await spec().get(`${url}/internal-error`).expectStatus(500).expectBody({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
    });
  });
});
