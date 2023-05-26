import path from 'path';
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
  resolve: {
    alias: {
      '#card': path.resolve(__dirname, './src/@core/card/'),
      '#station': path.resolve(__dirname, './src/@core/station/'),
      '#shared': path.resolve(__dirname, './src/@core/@shared/'),
      '#core': path.resolve(__dirname, './src/@core/'),
      '#api': path.resolve(__dirname, './src/api/'),
    },
  },
});
