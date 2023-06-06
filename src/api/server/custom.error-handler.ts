import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ValidationError } from 'yup';

import { HttpStatusCode } from '#shared/app/utils/http-status-code.enum';
import { CustomException } from '#shared/domain/exception/custom.exception';
import { InternalServerErrorException } from '#shared/domain/exception/internal-server-error.exception';

export const customErrorHandler = () => {
  return (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    if (error instanceof ValidationError) {
      return reply.status(HttpStatusCode.UNPROCESSABLE_ENTITY).send({
        statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
        error: error.name,
        message: error.message,
      });
    } else if (error instanceof CustomException) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      });
    }

    throw new InternalServerErrorException();
  };
};
