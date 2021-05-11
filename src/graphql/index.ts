import 'reflect-metadata';
import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import mercurius from 'mercurius';
import { PrismaClient, Users } from '@prisma/client';
import {
  FindFirstFeedItemsResolver,
  FindManyFeedItemsResolver,
  FindManyGuildsResolver,
  FindFirstGuildsResolver,
  relationResolvers,
} from '@generated/type-graphql';
import { applyMiddleware } from 'graphql-middleware';
import permissions from './permissions';
import { buildSchema } from 'type-graphql';
import { ActionsCreateResolver, CommentCreateResolver } from './resolvers';

const plugin: FastifyPluginCallback = async (instance, opts, done) => {
  const schema = await buildSchema({
    resolvers: [
      FindFirstFeedItemsResolver,
      FindManyFeedItemsResolver,
      FindFirstGuildsResolver,
      FindManyGuildsResolver,
      ActionsCreateResolver,
      CommentCreateResolver,
      ...relationResolvers,
    ],
    validate: false,
  });

  const schemaWithMiddleware = applyMiddleware(schema, permissions);

  instance.register(mercurius, {
    schema: schemaWithMiddleware,
    graphiql: 'playground',
    prefix: '/api',
    context: req =>
      instance.auth
        .validateToken(req)
        .then(() => instance.auth.validateUser(req))
        .then(user => ({
          user: user,
          prisma: instance.prisma,
        })),
  });

  done();
};

declare module 'mercurius' {
  interface MercuriusContext {
    prisma: PrismaClient;
    user: Users | null;
  }
}

export default fastifyPlugin(plugin);
