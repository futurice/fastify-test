import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import gracefulShutdown from 'fastify-graceful-shutdown';
import prisma from './plugins/prisma';
import graphql from './graphql';
import routes from './routes';

export function build(opts: FastifyServerOptions): FastifyInstance {
  const app = fastify(opts);
  app.register(gracefulShutdown);
  app.register(prisma);
  app.register(graphql);
  app.register(routes);
  return app;
}
