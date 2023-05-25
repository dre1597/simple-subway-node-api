import { FastifyReply, FastifyRequest } from 'fastify';

import { CardController } from '../controllers/card.controller';
import { CardFacadeFactory } from '../../@core/card/app/factory/card.facade.factory';
import { RepositoryVendor } from '../../@core/@shared/types/repository-vendor';

const cardController = new CardController(
  CardFacadeFactory.create(
    process.env.REPOSITORY_VENDOR as RepositoryVendor | undefined,
  ),
);

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
    const body = request.body as AddCardRequestBody;

    await cardController.add(body?.name, body?.balance);

    return reply.status(201).send();
  });

  fastify.patch(
    '/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as UpdateCardParam;
      const body = request.body as UpdateCardRequestBody;

      await cardController.update(Number(params.id), body?.name, body?.balance);

      return reply.status(204).send();
    },
  );

  fastify.get(
    '/:id/transactions',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as FindTransactionsByCardIdInputDto;

      const { transactions } = await cardController.findTransactionsByCardId(
        params.id,
      );

      return reply.status(200).send(transactions);
    },
  );

  done();
};
