import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import gracefulShutdown from 'fastify-graceful-shutdown';
import { docs } from './plugins/docs';
import routes from './routes';

export function build(opts: FastifyServerOptions): FastifyInstance {
  const app = fastify(opts);
  app.register(gracefulShutdown);
  app.register(fastifyPlugin(docs));
  app.register(routes);

  app.ready(err => {
    if (err) throw err;
    // Builds docs
    app.swagger();
  });

  app.addHook('onClose', (instance, done) => {
    // Release resources
    done();
  });

  return app;
}
