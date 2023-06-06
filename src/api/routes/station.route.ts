import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { FastifyReply, FastifyRequest } from 'fastify';

import { HttpStatusCode } from '#shared/app/utils/http-status-code.enum';
import { RepositoryVendor } from '#shared/app/utils/repository-vendor';
import { StationFacadeFactory } from '#station/app/factory/station.facade.factory';

import { StationController } from '../controllers/station.controller';

const stationController = new StationController(
  StationFacadeFactory.create(
    process.env.REPOSITORY_VENDOR as RepositoryVendor | undefined,
  ),
);

export type AddStationBody = {
  name: string;
  line: string;
};

export type FindStationByIdParams = {
  id: number;
};

export type UpdateStationByIdParams = {
  id: number;
};

export type UpdateStationBody = {
  name?: string;
  line?: string;
};

export type RemoveStationParams = {
  id: number;
};

const stationRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/stations',
    {
      schema: {
        tags: ['Stations'],
        description: 'Add a station',
        body: {
          type: 'object',
          required: ['name', 'line'],
          properties: {
            name: { type: 'string', default: 'any_name' },
            line: { type: 'string', default: 'any_line' },
          },
        },
        response: {
          201: {
            description: 'Station created',
            type: 'object',
            properties: {},
          },
          409: {
            type: 'object',
            description: 'Station already exists',
            properties: {
              statusCode: { type: 'number', default: 409 },
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'ConflictError' },
            },
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
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'InternalServerError' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as AddStationBody;

      await stationController.add(body?.name, body?.line);

      return reply.status(HttpStatusCode.CREATED).send();
    },
  );

  fastify.get(
    '/stations',
    {
      schema: {
        tags: ['Stations'],
        description: 'Find all stations',
        response: {
          200: {
            description: 'Stations found',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
                line: { type: 'string' },
              },
            },
          },
          500: {
            type: 'object',
            description: 'Internal server error',
            properties: {
              statusCode: { type: 'number', default: 500 },
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'InternalServerError' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { stations } = await stationController.findAll();

      return reply.status(HttpStatusCode.OK).send(stations);
    },
  );

  fastify.get(
    '/stations/:id',
    {
      schema: {
        tags: ['Stations'],
        description: 'Find station by id',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
          },
        },
        response: {
          200: {
            type: 'object',
            description: 'Station found',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              line: { type: 'string' },
            },
          },
          404: {
            type: 'object',
            description: 'Station not found',
            properties: {
              statusCode: { type: 'number', default: 404 },
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'NotFoundError' },
            },
          },
          500: {
            type: 'object',
            description: 'Internal server error',
            properties: {
              statusCode: { type: 'number', default: 500 },
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'InternalServerError' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as FindStationByIdParams;

      const { station } = await stationController.findById(params.id);

      return reply.status(HttpStatusCode.OK).send(station);
    },
  );

  fastify.patch(
    '/stations/:id',
    {
      schema: {
        tags: ['Stations'],
        description: 'Update station by id',
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
            name: { type: 'string', nullable: true },
            line: { type: 'string', nullable: true },
          },
        },
        response: {
          204: {
            description: 'Station updated',
            type: 'object',
            properties: {},
          },
          404: {
            type: 'object',
            description: 'Station not found',
            properties: {
              statusCode: { type: 'number', default: 404 },
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'NotFoundError' },
            },
          },
          409: {
            type: 'object',
            description: 'Station already exists',
            properties: {
              statusCode: { type: 'number', default: 409 },
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'ConflictError' },
            },
          },
          422: {
            type: 'object',
            description: 'Some value is invalid',
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
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'InternalServerError' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as UpdateStationByIdParams;
      const body = request.body as UpdateStationBody;

      await stationController.update(params.id, body?.name, body?.line);

      return reply.status(HttpStatusCode.NO_CONTENT).send();
    },
  );

  fastify.delete(
    '/stations/:id',
    {
      schema: {
        tags: ['Stations'],
        description: 'Remove station by id',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
          },
        },
        response: {
          204: {
            description: 'Station removed',
            type: 'object',
            properties: {},
          },
          404: {
            type: 'object',
            description: 'Station not found',
            properties: {
              statusCode: { type: 'number', default: 404 },
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'NotFoundError' },
            },
          },
          500: {
            type: 'object',
            description: 'Internal server error',
            properties: {
              statusCode: { type: 'number', default: 500 },
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'InternalServerError' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as RemoveStationParams;

      await stationController.remove(params.id);

      return reply.status(HttpStatusCode.NO_CONTENT).send();
    },
  );

  fastify.delete(
    '/stations/all',
    {
      schema: {
        tags: ['Stations'],
        description: 'Remove all stations',
        response: {
          204: {
            description: 'Stations removed',
            type: 'object',
            properties: {},
          },
          500: {
            type: 'object',
            description: 'Internal server error',
            properties: {
              statusCode: { type: 'number', default: 500 },
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'InternalServerError' },
            },
          },
        },
      },
    },
    async (_: FastifyRequest, reply: FastifyReply) => {
      await stationController.removeAll();

      return reply.status(HttpStatusCode.NO_CONTENT).send();
    },
  );

  fastify.put(
    '/stations/all',
    {
      schema: {
        tags: ['Stations'],
        description: 'Restore all stations',
        response: {
          204: {
            description: 'Stations restored',
            type: 'object',
            properties: {},
          },
          500: {
            type: 'object',
            description: 'Internal server error',
            properties: {
              statusCode: { type: 'number', default: 500 },
              message: {
                type: 'string',
              },
              error: { type: 'string', default: 'InternalServerError' },
            },
          },
        },
      },
    },
    async (_: FastifyRequest, reply: FastifyReply) => {
      await stationController.restoreAll();

      return reply.status(HttpStatusCode.NO_CONTENT).send();
    },
  );
};

export default stationRoute;
