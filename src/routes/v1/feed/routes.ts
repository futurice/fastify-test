import { FastifyPluginAsync } from 'fastify';
import { Static } from '@sinclair/typebox';
import { feedResponseSchema, feedQuerySchema } from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.get<{
    Querystring: Static<typeof feedQuerySchema>;
    Reply: Static<typeof feedResponseSchema>;
  }>(
    '/',
    {
      schema: {
        description: 'Main feed content',
        tags: ['feed'],
        response: {
          200: feedResponseSchema,
        },
      },
    },
    (req, res) => {
      res.status(200).send({
        ok: true,
      });
    },
  );
};

export default routes;
