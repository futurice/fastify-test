import 'reflect-metadata';
import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import mercurius from 'mercurius';
import { buildSchema } from 'type-graphql';
import { createPool, DatabasePoolType } from 'slonik';
import config from '../config';
import { FeedItemResolver } from './resolvers/feedItemResolver';
import { ActionTypeResolver } from './resolvers/actionTypeResolver';
import { ActionResolver } from './resolvers/actionResolver';
import { User } from '../queries/user';

const plugin: FastifyPluginCallback = async (instance, opts, done) => {
  instance.decorateRequest('db', {});
  instance.addHook('preHandler', (req, _, next) => {
    req.db = createPool(config.DATABASE_URL);
    next();
  });

  const schema = await buildSchema({
    resolvers: [FeedItemResolver, ActionTypeResolver, ActionResolver],
  });

  instance.register(mercurius, {
    schema,
    graphiql: 'playground',
    prefix: '/api',
    context: async req => {
      const { db } = req;
      return {
        db,
        user: await instance.auth
          .validateToken(req)
          .then(() => instance.auth.validateUser(req)),
      };
    },
  });

  done();
};

declare module 'mercurius' {
  interface MercuriusContext {
    db: DatabasePoolType;
    user: User;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    db: DatabasePoolType;
  }
}

export default fastifyPlugin(plugin);
