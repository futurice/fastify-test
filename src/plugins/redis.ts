import { FastifyPluginCallback, onCloseHookHandler } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import ioredis from 'ioredis';
import config from '../config';

const close: onCloseHookHandler = (fastify, done) => {
  fastify.redis.quit().then(() => done());
};

const plugin: FastifyPluginCallback = (instance, _, done) => {
  const client = new ioredis(config.REDIS_URL);
  instance.decorate('redis', client);
  instance.addHook('onClose', close);
  done();
};

declare module 'fastify' {
  interface FastifyInstance {
    redis: ioredis.Redis;
  }
}

export default fastifyPlugin(plugin);
