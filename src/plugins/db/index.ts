import { FastifyPluginCallback, FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import {
  createPool,
  DatabasePoolType,
  createBigintTypeParser,
  createDateTypeParser,
  createIntervalTypeParser,
  createNumericTypeParser,
} from 'slonik';
import {
  createTimestampWithTimeZoneTypeParser,
  createTimestampTypeParser,
} from './parsers';
import * as user from './queries/user-queries';
import * as action from './queries/action-queries';
import * as actionType from './queries/action-type-queries';
import * as feedItem from './queries/feed-item-queries';
import { transformNameInterceptors } from './utils';
import config from '../../config';

const plugin: FastifyPluginCallback = (instance, _, done) => {
  instance.decorateRequest('db', {});

  const sql: FastifyInstance['sql'] = {
    user,
    action,
    actionType,
    feedItem,
  };
  instance.decorate('sql', sql);

  instance.addHook('onRequest', (req, _, next) => {
    req.db = createPool(config.DATABASE_URL, {
      interceptors: [transformNameInterceptors()],
      typeParsers: [
        createBigintTypeParser(),
        createDateTypeParser(),
        createIntervalTypeParser(),
        createNumericTypeParser(),
        createTimestampTypeParser(),
        createTimestampWithTimeZoneTypeParser(),
      ],
    });
    next();
  });
  done();
};

declare module 'fastify' {
  interface FastifyRequest {
    db: DatabasePoolType;
  }

  interface FastifyInstance {
    sql: {
      user: typeof user;
      action: typeof action;
      actionType: typeof actionType;
      feedItem: typeof feedItem;
    };
  }
}

export default fastifyPlugin(plugin);
