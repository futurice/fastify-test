import { FastifyPluginAsync } from 'fastify';
import { fastifySwagger } from 'fastify-swagger';

export const docs: FastifyPluginAsync = instance => {
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
