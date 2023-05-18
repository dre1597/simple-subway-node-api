import { FastifyReply, FastifyRequest } from 'fastify';
import { ValidationError } from 'yup';

import { CardController } from '../controllers/card.controller';
import { CardFacadeFactory } from '../../@core/cards/app/factory/card.facade.factory';
import { AddCardValidator } from '../validators/add-card.validator';
import { InternalServerErrorException } from '../../@core/@shared/exception/internal-server-error.exception';
import { CustomException } from '../../@core/@shared/exception/custom.exception';
import { UpdateCardValidator } from '../validators/update-card.validator';

const cardController = new CardController(CardFacadeFactory.create('MYSQL'));

export type AddCardRequestBody = {
  name: string;
};

export type UpdateCardParam = {
  id: number;
};

export type UpdateCardRequestBody = {
  name?: string;
};

export type FindTransactionsByCardIdInputDto = {
  id: number;
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

  fastify.put('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as UpdateCardParam;
      const { name } = request.body as UpdateCardRequestBody;

      await UpdateCardValidator.validate(name);

      await cardController.update(Number(id), name);

      return reply.status(204).send();
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

  fastify.get(
    '/:id/transactions',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as FindTransactionsByCardIdInputDto;

        const { transactions } = await cardController.findTransactionsByCardId(
          id,
        );

        return reply.status(200).send(transactions);
      } catch (error) {
        if (error instanceof CustomException) {
          return reply.status(error.statusCode).send({
            statusCode: error.statusCode,
            error: error.name,
            message: error.message,
          });
        }
        throw new InternalServerErrorException();
      }
    },
  );

  done();
};
