import { FastifyReply, FastifyRequest } from 'fastify';

import { CardController } from '../controllers/card.controller';
import { CardFacadeFactory } from '../../@core/cards/app/factory/card.facade.factory';

const cardController = new CardController(CardFacadeFactory.create('MYSQL'));

export type AddCardRequestBody = {
  name: string;
  balance?: number;
};

export type UpdateCardParam = {
  id: number;
};

export type UpdateCardRequestBody = {
  name?: string;
  balance?: number;
};

export type FindTransactionsByCardIdInputDto = {
  id: number;
};

export const cardRoute = (fastify, _, done) => {
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, balance } = request.body as AddCardRequestBody;

    await cardController.add(name, balance);

    return reply.status(201).send();
  });

  fastify.put('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as UpdateCardParam;
    const { name, balance } = request.body as UpdateCardRequestBody;

    await cardController.update(Number(id), name, balance);

    return reply.status(204).send();
  });

  fastify.get(
    '/:id/transactions',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as FindTransactionsByCardIdInputDto;

      const { transactions } = await cardController.findTransactionsByCardId(
        id,
      );

      return reply.status(200).send(transactions);
    },
  );

  done();
};
