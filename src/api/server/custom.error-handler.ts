import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ValidationError } from 'yup';

import { CustomException } from '../../@core/@shared/exception/custom.exception';
import { InternalServerErrorException } from '../../@core/@shared/exception/internal-server-error.exception';
import { HttpStatusCode } from '../../@core/@shared/utils/http-status-code.enum';

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
