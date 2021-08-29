import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { fastifySwagger } from 'fastify-swagger';

const plugin: FastifyPluginCallback = (instance, _, done) => {
  instance.register(fastifySwagger, {
    routePrefix: '/api/docs',
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Fastify API',
        version: '1.0.0',
      },
    },
  });

  instance.ready(err => {
    if (err) throw err;
    instance.swagger();
  });

  done();
};

export const docs = fastifyPlugin(plugin);
