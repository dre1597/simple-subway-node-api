import { FastifyReply, FastifyRequest } from 'fastify';
import { ValidationError } from 'yup';

import { CardController } from '../controllers/card.controller';
import { CardFacadeFactory } from '../../@core/cards/app/factory/card.facade.factory';
import { AddCardValidator } from '../validators/add-card.validator';
import { InternalServerErrorException } from '../../@core/@shared/exception/internal-server-error.exception';
import { CustomException } from '../../@core/@shared/exception/custom.exception';

const cardController = new CardController(CardFacadeFactory.create('MYSQL'));

export type AddCardRequestBody = {
  name: string;
};

export const cardRoute = (fastify, _, done) => {
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name } = request.body as AddCardRequestBody;

      await AddCardValidator.validate(name);

      await cardController.add(name);

      return reply.status(201).send();
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply
          .status(422)
          .send({ statusCode: 422, error: error.name, message: error.message });
      } else if (error instanceof CustomException) {
        return reply.status(error.statusCode).send({
          statusCode: error.statusCode,
          error: error.name,
          message: error.message,
        });
      }

      throw new InternalServerErrorException();
    }
  });
  done();
};
