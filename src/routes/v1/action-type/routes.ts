import { FastifyPluginAsync } from 'fastify';
import { Static } from '@sinclair/typebox';
import { actionTypeResponseSchema } from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.get<{
    Reply: Static<typeof actionTypeResponseSchema>;
  }>(
    '/',
    {
      schema: {
        description: 'Supported action types',
        tags: ['action-type'],
        response: {
          200: actionTypeResponseSchema,
        },
      },
    },
    (req, res) => {
      res.status(200).send([]);
    },
  );
};

export default routes;
