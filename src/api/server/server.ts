import fastify from 'fastify';
import { helloRoute } from '../routes/hello.route';
import { cardRoute } from '../routes/card.route';

export const app = fastify({ logger: true });

export const init = async () => {
  try {
    app.register(helloRoute);
    app.register(cardRoute, { prefix: '/cards' });

    await app.listen({ port: 3000 });
    app.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
