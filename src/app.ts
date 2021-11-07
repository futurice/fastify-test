import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import gracefulShutdown from 'fastify-graceful-shutdown';
import sensible from 'fastify-sensible';
import authPlugin from './plugins/auth';
import db from './plugins/db';
import redis from './plugins/redis';
import routes from './routes';
import config from './config';

export function build(
  opts: FastifyServerOptions,
  useGracefulShutdown: boolean = true,
): FastifyInstance {
  const app = fastify(opts);

  if (useGracefulShutdown) {
    // The graceful shutdown module messes up Mocha tests.
    // Tests restart the server multiple times, but the gracefulShutdown
    // module doesn't clear its garbage and crashes on restart.
    app.register(gracefulShutdown);
  }

  app.register(sensible);
  app.register(redis);
  app.register(db);
  app.register(authPlugin, { token: config.TOKEN });
  app.register(routes);
  return app;
}
