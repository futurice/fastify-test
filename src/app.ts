import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import gracefulShutdown from 'fastify-graceful-shutdown';
import db from './plugins/db';
import routes from './routes';

export function build(opts: FastifyServerOptions): FastifyInstance {
  const app = fastify(opts);
  app.register(gracefulShutdown);
  app.register(db);
  app.register(routes);
  return app;
}
