import { FastifyPluginAsync } from 'fastify';
import { TestRouteSchema } from './schemas';
import { testHandler } from './handlers';

export const routes: FastifyPluginAsync = async fastify => {
  fastify.get('/', { schema: TestRouteSchema }, testHandler);
};

export default routes;
