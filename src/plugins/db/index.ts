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
import * as queries from '../../queries';
import { transformNameInterceptors } from './utils';
import config from '../../config';

let pool: DatabasePoolType;
export function getPool(): DatabasePoolType {
  if (!pool) {
    pool = createPool(config.DATABASE_URL, {
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
  }
  return pool;
}

const plugin: FastifyPluginCallback = (instance, _, done) => {
  instance.decorate('db', getPool());

  const sql: FastifyInstance['sql'] = queries;
  instance.decorate('sql', sql);

  done();
};

declare module 'fastify' {
  interface FastifyInstance {
    db: DatabasePoolType;
    sql: typeof queries;
  }
}

export default fastifyPlugin(plugin);
