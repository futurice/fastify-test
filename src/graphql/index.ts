import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import mercurius from 'mercurius';
import mercuriusCodegen from 'mercurius-codegen';
import { PrismaClient, Users } from '@prisma/client';
import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from '@graphql-tools/schema';
import permissions from './permissions';
import typeDefs from './typedefs';
import resolvers from './resolvers';

const plugin: FastifyPluginCallback = async (instance, opts, done) => {
  const schemaWithMiddleware = applyMiddleware(
    makeExecutableSchema({ typeDefs, resolvers }),
    permissions,
  );

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

  mercuriusCodegen(instance, {
    targetPath: './src/graphql/generated/types.ts',
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
