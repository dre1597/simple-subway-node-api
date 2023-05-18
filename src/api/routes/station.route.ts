import { FastifyReply, FastifyRequest } from 'fastify';
import { StationController } from '../controllers/station.controller';
import { StationFacadeFactory } from '../../@core/station/app/factory/station.facade.factory';

const stationController = new StationController(
  StationFacadeFactory.create('MYSQL'),
);

export type AddStationBody = {
  name: string;
  line: string;
};

export type FindStationByIdParams = {
  id: number;
};

export const stationRoute = (fastify, _, done) => {
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, line } = request.body as AddStationBody;

    await stationController.add(name, line);

    return reply.status(201).send();
  });

  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { stations } = await stationController.findAll();

    return reply.status(200).send(stations);
  });

  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as FindStationByIdParams;

    const { station } = await stationController.findById(id);

    return reply.status(200).send(station);
  });

  done();
};
