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

  fastify.get('/', { schema: { hide: true } }, (req, res) => {
    res.send('pong');
  });

  fastify.register(autoload, {
    dir: path.join(__dirname, 'endpoints'),
    ignorePattern: /(schemas)(\.ts|\.js|\.cjs|\.mjs)$/,
    options: { prefix: '/api' },
  });
};

export default routes;
