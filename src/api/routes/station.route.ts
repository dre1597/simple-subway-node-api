import { FastifyReply, FastifyRequest } from 'fastify';
import { StationController } from '../controllers/station.controller';
import { StationFacadeFactory } from '../../@core/station/app/factory/station.facade.factory';
import { RepositoryVendor } from '../../@core/@shared/types/repository-vendor';

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

export const stationRoute = (fastify, _, done) => {
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as AddStationBody;

    await stationController.add(body?.name, body?.line);

    return reply.status(201).send();
  });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { stations } = await stationController.findAll();

    return reply.status(200).send(stations);
  });

  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as FindStationByIdParams;

    const { station } = await stationController.findById(params.id);

    return reply.status(200).send(station);
  });

  fastify.patch(
    '/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as UpdateStationByIdParams;
      const body = request.body as UpdateStationBody;

      await stationController.update(params.id, body?.name, body?.line);

      return reply.status(204).send();
    },
  );

  fastify.delete(
    '/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as RemoveStationParams;

      await stationController.remove(params.id);

      return reply.status(204).send();
    },
  );

  fastify.delete('/all', async (_: FastifyRequest, reply: FastifyReply) => {
    await stationController.removeAll();

    return reply.status(204).send();
  });

  fastify.put('/all', async (_: FastifyRequest, reply: FastifyReply) => {
    await stationController.restoreAll();

    return reply.status(204).send();
  });

  done();
};
