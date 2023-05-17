import fastify from 'fastify';

export const app = fastify({ logger: true });

export const init = async () => {
  try {
    await app.listen({ port: 3000 });
    app.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
