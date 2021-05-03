import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import gracefulShutdown from 'fastify-graceful-shutdown';
import sensible from 'fastify-sensible';
import prisma from './plugins/prisma';
import authPlugin from './plugins/auth';
import graphql from './graphql';
import routes from './routes';
import config from './config';

export function build(opts: FastifyServerOptions): FastifyInstance {
  const app = fastify(opts);
  app.register(gracefulShutdown);
  app.register(sensible);
  app.register(authPlugin, { token: config.TOKEN });
  app.register(prisma);
  app.register(graphql);
  app.register(routes);
  return app;
}
