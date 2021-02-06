import { FastifyPluginAsync } from 'fastify';
import { TestRouteSchema } from './schemas';
import { testHandler } from './handlers';

export const routes: FastifyPluginAsync = async fastify => {
  fastify.get('/:id', { schema: TestRouteSchema }, testHandler);
  fastify.get('/someOtherRoute/:id', { schema: TestRouteSchema }, testHandler);
};

export default routes;
