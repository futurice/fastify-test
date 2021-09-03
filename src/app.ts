import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import gracefulShutdown from 'fastify-graceful-shutdown';
import sensible from 'fastify-sensible';
import authPlugin from './plugins/auth';
import db from './plugins/db';
import redis from './plugins/redis';
import routes from './routes';
import config from './config';

export function build(opts: FastifyServerOptions): FastifyInstance {
  const app = fastify(opts);
  app.register(gracefulShutdown);
  app.register(sensible);
  app.register(redis);
  app.register(db);
  app.register(authPlugin, { token: config.TOKEN });
  app.register(routes);
  return app;
}
