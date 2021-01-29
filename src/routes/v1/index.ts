import { FastifyPluginAsync } from 'fastify';
import testRoutes  from './test/routes';


const routes: FastifyPluginAsync = (instance) => {
  instance.register(testRoutes, { prefix: 'test' });
  return Promise.resolve();
};

export default routes;
