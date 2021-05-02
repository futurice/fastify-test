import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

const plugin: FastifyPluginCallback = (instance, opts, done) => {
  const prisma = new PrismaClient();
  instance.decorate('prisma', prisma);
  instance.addHook('onClose', (_, onCloseDone) => {
    prisma.$disconnect();
    onCloseDone();
  });
  done();
};

export default fastifyPlugin(plugin);

declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof PrismaClient;
  }
}
