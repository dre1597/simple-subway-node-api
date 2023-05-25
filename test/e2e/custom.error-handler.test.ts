import fastify from 'fastify';
import { ValidationError } from 'yup';
import { spec } from 'pactum';

import { customErrorHandler } from '../../src/api/server/custom.error-handler';
import { CustomException } from '../../src/@core/@shared/exception/custom.exception';
import { HttpStatusCode } from '../../src/@core/@shared/utils/http-status-code.enum';

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
        throw new CustomException(
          HttpStatusCode.BAD_REQUEST,
          'any_name',
          'any_message',
        );
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
    await spec()
      .get(`${url}/validation-error`)
      .expectStatus(HttpStatusCode.UNPROCESSABLE_ENTITY)
      .expectBody({
        statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
        error: 'ValidationError',
        message: 'any_error',
      });
  });

  it('should throw a CustomException if the route throws', async () => {
    await spec()
      .get(`${url}/custom-exception`)
      .expectStatus(HttpStatusCode.BAD_REQUEST)
      .expectBody({
        statusCode: HttpStatusCode.BAD_REQUEST,
        error: 'any_name',
        message: 'any_message',
      });
  });

  it('should throw a InternalServerErrorException if the route throws', async () => {
    await spec()
      .get(`${url}/internal-error`)
      .expectStatus(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .expectBody({
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'Internal Server Error',
      });
  });
});
