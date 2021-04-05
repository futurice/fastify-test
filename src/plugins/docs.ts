import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { fastifySwagger } from 'fastify-swagger';

const plugin: FastifyPluginAsync = instance => {
  instance.register(fastifySwagger, {
    routePrefix: '/docs',
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Fastify API',
        description:
          'Building a blazing fast REST API with Node.js, MongoDB, Fastify and Swagger',
        version: '1.0.0',
      },
    },
  });

  instance.ready(err => {
    if (err) throw err;
    instance.swagger();
  });

  return Promise.resolve();
};

export const docs = fastifyPlugin(plugin);
