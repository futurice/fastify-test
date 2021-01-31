import { Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

export const requestBodySchema = Type.Object({
  email: Type.Readonly(Type.String({ format: 'email' })),
});

export const  responseBodySchema = Type.Object({
  ok: Type.Boolean(),
  number: Type.Number(),
});

export const queryStringSchema = Type.Object({
  test: Type.ReadonlyOptional(Type.Number({ minimum: 200 })),
});

export const TestRouteSchema : FastifySchema = {
  description: 'Test route description',
  tags: ['test'],
  querystring: queryStringSchema,
  response: {
    200: responseBodySchema,
  },
}
