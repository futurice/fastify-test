import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { createPool, DatabasePoolType } from 'slonik';
import * as user from './queries/user-queries';
import config from '../../config';

const plugin: FastifyPluginCallback = (instance, _, done) => {
  instance.decorateRequest('db', {});
  instance.decorateRequest('sql', {});

  instance.addHook('preHandler', (req, _, next) => {
    req.db = createPool(config.DATABASE_URL);
    req.sql = {
      user,
    };
    next();
  });
  done();
};

declare module 'fastify' {
  interface FastifyRequest {
    db: DatabasePoolType;
    sql: {
      user: typeof user;
    };
  }
}

export default fastifyPlugin(plugin);
