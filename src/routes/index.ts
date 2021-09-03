import path from 'path';
import { FastifyPluginAsync } from 'fastify';
import autoload from 'fastify-autoload';
import { docs } from '../plugins/docs';
import { routePrinter } from '../plugins/route-printer';
import throttle from '../plugins/throttle';

const routes: FastifyPluginAsync = async fastify => {
  fastify.register(routePrinter);
  fastify.register(docs);
  fastify.register(throttle);

  fastify.ready(err => {
    if (err) throw err;
    // Builds docs
    fastify.swagger();
  });

  // App service pings the root URL to check that the container is up
  // and running. Respond with a dummy response so our logs are not
  // littered 404s from GET "/".
  fastify.get('/', { schema: { hide: true } }, (req, res) => {
    res.send('pong');
  });

  fastify.register(autoload, {
    dir: path.join(__dirname),
    indexPattern: /.*route(\.ts|\.js|\.cjs|\.mjs)$/,
    // Ignore this file to avoid autoload
    // trying to re-register this plugin.
    ignorePattern: /index(\.ts|\.js|\.cjs|\.mjs)$/,
    options: { prefix: '/api' },
  });
};

export default routes;
