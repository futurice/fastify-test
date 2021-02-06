import { FastifyPluginAsync } from 'fastify';
import { TestRouteSchema } from './schemas';
import { testHandler } from './handlers';

const routes: FastifyPluginAsync = async fastify => {
  fastify.get('/some-other-route', { schema: TestRouteSchema }, testHandler);
};

export default routes;
