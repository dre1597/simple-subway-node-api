import AutoLoad from '@fastify/autoload';
import Swagger from '@fastify/swagger';
import SwaggerUI from '@fastify/swagger-ui';
import { config } from 'dotenv';
import fastify from 'fastify';
import { join } from 'path';

import { MySQLMigration } from '../../database/mysql/migration';
import { customErrorHandler } from './custom.error-handler';

config();

export const app = fastify({ logger: true });

export const init = async () => {
  try {
    app.register(Swagger, {
      swagger: {
        info: {
          title: 'Simple Subway API',
          version: '1.0.0',
          description:
            'Simple api to practice some MySQL (triggers, procedures, views, etc.), tests, architecture and check out some technologies like Pnpm, Fastify, Pactum, Yup and more.',
        },
        host: 'localhost:3000',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
      },
    });

    app.register(SwaggerUI);

    app.setErrorHandler(customErrorHandler());
    app.register(AutoLoad, {
      dir: join(__dirname, '..', './routes'),
    });

    if (
      process.env.NODE_ENV !== 'test' &&
      process.env.REPOSITORY_VENDOR === 'MYSQL'
    ) {
      const migration = new MySQLMigration();
      await migration.run();
    }

    await app.listen({ port: 3000 });
    app.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
