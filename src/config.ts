import type { SwaggerOptions } from 'fastify-swagger';

const swaggerConfig : SwaggerOptions = {
  routePrefix: '/docs',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Fastify API',
      description: 'Building a blazing fast REST API with Node.js, MongoDB, Fastify and Swagger',
      version: '1.0.0'
    },
  }
};

const config = {
  PORT: process.env.PORT || 8080,
  swaggerConfig, 
};

export default config;
