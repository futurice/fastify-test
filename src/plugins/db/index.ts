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
import * as comment from './queries/comment-queries';
import { transformNameInterceptors } from './utils';
import config from '../../config';

const plugin: FastifyPluginCallback = (instance, _, done) => {
  const pool = createPool(config.DATABASE_URL, {
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
  instance.decorate('db', pool);

  const sql: FastifyInstance['sql'] = {
    user,
    action,
    actionType,
    feedItem,
    comment,
  };
  instance.decorate('sql', sql);

  done();
};

declare module 'fastify' {
  interface FastifyInstance {
    db: DatabasePoolType;
    sql: {
      user: typeof user;
      action: typeof action;
      actionType: typeof actionType;
      feedItem: typeof feedItem;
      comment: typeof comment;
    };
  }
}

export default fastifyPlugin(plugin);
