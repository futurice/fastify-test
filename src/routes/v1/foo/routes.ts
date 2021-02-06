import { FastifyPluginAsync } from 'fastify';
import { TestRouteSchema } from './schemas';
import { testHandler } from './handlers';

export const routes: FastifyPluginAsync = async fastify => {
  fastify.get(
    '/',
    { schema: TestRouteSchema, onRequest: fastify.basicAuth },
    testHandler,
  );
};

export default routes;
