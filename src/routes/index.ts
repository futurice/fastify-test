import { FastifyPluginAsync } from 'fastify';
import v1Routes from './v1';


const routes: FastifyPluginAsync = (instance) => {
  instance.register(v1Routes, { prefix: 'v1'});
  return Promise.resolve();
};

export default routes;
