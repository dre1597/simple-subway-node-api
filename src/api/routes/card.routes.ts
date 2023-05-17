import { FastifyReply, FastifyRequest } from 'fastify';
import { CardController } from '../controllers/card.controller';
import { CardFacadeFactory } from '../../@core/cards/app/factory/card.facade.factory';
import { AddCardValidator } from '../validators/add-card.validator';
import { ValidationError } from 'yup';
import { InternalServerErrorException } from '../../@core/@shared/exception/internal-server-error.exception';

const cardController = new CardController(CardFacadeFactory.create('MYSQL'));

export type AddCardRequestBody = {
  name: string;
};

export const cardRoutes = (fastify, _, done) => {
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name } = request.body as AddCardRequestBody;

      await AddCardValidator.validate(name);

      await cardController.add(name);
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.status(422).send({ error: error.message });
      }

      throw new InternalServerErrorException();
    }
  });
  done();
};
