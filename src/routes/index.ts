import path from 'path';
import { FastifyPluginAsync } from 'fastify';
import autoload from 'fastify-autoload';

const routes: FastifyPluginAsync = async fastify => {
  // App service pings the root URL to check that the container is up
  // and running. Respond with a dummy response so our logs are not
  // littered 404s from GET "/".
  fastify.get('/', (req, res) => {
    res.send('pong');
  });

  console.log(path.join(__dirname));

  fastify.register(autoload, {
    dir: path.join(__dirname),
    indexPattern: /.*routes\.ts/,
    // Ignore this file to avoid autoload
    // trying to re-register this plugin.
    ignorePattern: /index.ts/,
    options: { prefix: '/api' },
  });
};

export default routes;
