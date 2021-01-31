import type { SwaggerOptions } from 'fastify-swagger';

const config = {
  PORT: process.env.PORT || 8080,
  WEB_CONCURRENCY: process.env.WEB_CONCURRENCY || 1,
};

export default config;
