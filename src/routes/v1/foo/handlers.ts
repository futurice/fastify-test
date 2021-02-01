import { Static } from '@sinclair/typebox'
import { RouteHandler, RouteGenericInterface } from 'fastify/types/route';
import { responseBodySchema } from './schemas';


interface TestRoute extends RouteGenericInterface {
  Reply: Static<typeof responseBodySchema>
}

export const testHandler: RouteHandler<TestRoute> = async (req, res) => {
  return res.send({
    ok: true,
  });
}