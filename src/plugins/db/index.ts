import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { createPool, DatabasePoolType } from 'slonik';
import * as user from './queries/user-queries';
import * as action from './queries/action-queries';
import * as actionType from './queries/action-type-queries';
import * as feedItem from './queries/feed-item-queries';
import { transformNameInterceptors } from './utils';
import config from '../../config';

const plugin: FastifyPluginCallback = (instance, _, done) => {
  instance.decorateRequest('db', {});
  instance.decorateRequest('sql', {});

  instance.addHook('onRequest', (req, _, next) => {
    req.db = createPool(config.DATABASE_URL, {
      interceptors: [transformNameInterceptors()],
    });
    req.sql = {
      user,
      action,
      actionType,
      feedItem,
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
      action: typeof action;
      actionType: typeof actionType;
      feedItem: typeof feedItem;
    };
  }
}

export default fastifyPlugin(plugin);
