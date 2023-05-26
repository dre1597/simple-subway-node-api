import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { FastifyReply, FastifyRequest } from 'fastify';

import { CardFacadeFactory } from '#card/app/factory/card.facade.factory';
import { HttpStatusCode } from '#core/@shared/utils/http-status-code.enum';
import { RepositoryVendor } from '#core/@shared/utils/repository-vendor';

import { CardController } from '../controllers/card.controller';

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

const cardRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/cards',
    {
      schema: {
        tags: ['Cards'],
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', default: 'any_name' },
            balance: { type: 'number', default: 0, nullable: true },
          },
        },
        response: {
          201: {
            description: 'Card created',
            type: 'object',
            properties: {},
          },
          422: {
            type: 'object',
            description: 'Some value is missing or is invalid',
            properties: {
              statusCode: { type: 'number', default: 422 },
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'ValidationError' },
            },
          },
          500: {
            type: 'object',
            description: 'Internal server error',
            properties: {
              statusCode: { type: 'number', default: 500 },
              message: { type: 'string', default: 'Internal Server Error' },
              error: { type: 'string', default: 'Internal Server Error' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as AddCardRequestBody;

      await cardController.add(body?.name, body?.balance);

      return reply.status(HttpStatusCode.CREATED).send();
    },
  );

  fastify.patch(
    '/cards/:id',
    {
      schema: {
        tags: ['Cards'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
          },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', default: 'updated_name', nullable: true },
            balance: { type: 'number', default: 0, nullable: true },
          },
        },
        response: {
          204: {
            description: 'Card updated',
            type: 'object',
            properties: {},
          },
          422: {
            type: 'object',
            description: 'Some value is invalid',
            properties: {
              statusCode: { type: 'number', default: 422 },
              message: {
                type: 'string',
                default: 'detailed error message',
              },
              error: { type: 'string', default: 'ValidationError' },
            },
          },
          500: {
            type: 'object',
            description: 'Internal server error',
            properties: {
              statusCode: { type: 'number', default: 500 },
              message: { type: 'string', default: 'Internal Server Error' },
              error: { type: 'string', default: 'Internal Server Error' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as UpdateCardParam;
      const body = request.body as UpdateCardRequestBody;

      await cardController.update(Number(params.id), body?.name, body?.balance);

      return reply.status(HttpStatusCode.NO_CONTENT).send();
    },
  );

  fastify.get(
    '/cards/:id/transactions',
    {
      schema: {
        tags: ['Cards'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
          },
        },
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', default: 1 },
                card: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', default: 1 },
                    name: { type: 'string', default: 'any_name' },
                    balance: { type: 'number' },
                  },
                },
                amount: { type: 'number' },
                timestamp: { type: 'string', default: 'any_timestamp' },
              },
            },
          },
          500: {
            type: 'object',
            description: 'Internal server error',
            properties: {
              statusCode: { type: 'number', default: 500 },
              message: { type: 'string', default: 'Internal Server Error' },
              error: { type: 'string', default: 'Internal Server Error' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as FindTransactionsByCardIdInputDto;

      const { transactions } = await cardController.findTransactionsByCardId(
        params.id,
      );

      return reply.status(HttpStatusCode.OK).send(transactions);
    },
  );
};

export default cardRoute;
