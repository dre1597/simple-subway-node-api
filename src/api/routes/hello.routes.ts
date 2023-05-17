import { HelloController } from '../controllers/hello.controller';

const helloController = new HelloController();

export const helloRoutes = (fastify, _, done) => {
  fastify.get('/', async () => {
    return helloController.get();
  });
  done();
};
