import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import mercurius from 'mercurius';
import mercuriusCodegen from 'mercurius-codegen';
import { PrismaClient } from '@prisma/client';
import schema from './schema';
import resolvers from './resolvers';

const plugin: FastifyPluginCallback = (instance, opts, done) => {
  instance.register(mercurius, {
    schema,
    resolvers,
    graphiql: true,
    ide: true,
    context: () => {
      return {
        prisma: instance.prisma,
      };
    },
  });

  mercuriusCodegen(instance, {
    targetPath: './src/graphql/generated/types.ts',
  });

  done();
};

declare module 'mercurius' {
  interface MercuriusContext {
    prisma: PrismaClient;
  }
}

export default fastifyPlugin(plugin);
