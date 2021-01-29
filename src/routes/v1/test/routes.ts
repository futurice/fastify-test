import { FastifyPluginAsync } from 'fastify';
import { TempRouteSchema } from './schemas';
import { testHandler } from './handlers';


const routes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', { schema: TempRouteSchema }, testHandler);
};

export default routes;