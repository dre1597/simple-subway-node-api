import { HelloController } from '../controllers/hello.controller';

const helloController = new HelloController();

export const helloRoute = (fastify, _, done) => {
  fastify.get('/', async () => {
    return helloController.get();
  });
  done();
};
