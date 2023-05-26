import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import { HelloController } from '../controllers/hello.controller';

const helloController = new HelloController();

const helloRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Hello'],
        response: {
          200: Type.Object({
            hello: Type.String(),
          }),
        },
      },
    },
    async () => {
      return helloController.get();
    },
  );
};

export default helloRoute;
