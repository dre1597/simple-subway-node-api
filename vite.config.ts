import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    env: {},
    threads: false,
    isolate: true,
    deps: {
      inline: ['@fastify/autoload', '@fastify/swagger', '@fastify/swagger-ui'],
    },
  },
  plugins: [tsconfigPaths({})],
});
