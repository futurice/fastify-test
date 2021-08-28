import { FastifyPluginAsync } from 'fastify';
import { Static } from '@sinclair/typebox';
import { actionTypeResponseSchema } from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.get<{
    Reply: Static<typeof actionTypeResponseSchema>;
  }>(
    '/',
    fastify.secureRoute.authenticated({
      schema: {
        description: 'Lists supported action types',
        tags: ['action-type'],
        response: {
          200: actionTypeResponseSchema,
        },
      },
    }),
    async (req, res) => {
      const result = await req.db.any(req.sql.actionType.findAllUserActions());
      const response = result.map(({ code, name, cooldown }) => ({
        code,
        name,
        cooldown,
      }));
      res.status(200).send(response);
    },
  );
};

export default routes;
