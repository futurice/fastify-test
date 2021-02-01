import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

export const requestBodySchema = Type.Object({
  email: Type.Readonly(Type.String({ format: 'email' })),
});

export const  responseBodySchema = Type.Object({
  ok: Type.Boolean(),
});


export const TestRouteSchema : FastifySchema = {
  description: 'Foo route description',
  tags: ['foo'],
  response: {
    200: responseBodySchema,
  },
}
