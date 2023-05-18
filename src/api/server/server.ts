import fastify from 'fastify';

import { customErrorHandler } from './custom.error-handler';
import { helloRoute } from '../routes/hello.route';
import { cardRoute } from '../routes/card.route';
import { stationRoute } from '../routes/station.route';

export const app = fastify({ logger: true });

export const init = async () => {
  try {
    app.setErrorHandler(customErrorHandler());

    app.register(helloRoute);
    app.register(cardRoute, { prefix: '/cards' });
    app.register(stationRoute, { prefix: '/stations' });

    await app.listen({ port: 3000 });
    app.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
