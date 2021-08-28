import { FastifyPluginAsync } from 'fastify';
import { Static } from '@sinclair/typebox';
import { createActionInputSchema, createActionResponseSchema } from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.post<{
    Reply: Static<typeof createActionResponseSchema>;
    Body: Static<typeof createActionInputSchema>;
  }>(
    '/',
    fastify.secureRoute.user({
      schema: {
        description: 'Create action',
        tags: ['action'],
        response: {},
      },
    }),
    async (req, res) => {
      const { imageData, text, type } = req.body;
      return req.db
        .one(
          req.sql.action.create({
            userId: 1,
            imagePath: imageData ?? null,
            text: text ?? null,
            actionTypeCode: type,
          }),
        )
        .then(() => {
          res.status(200).send({
            success: true,
          });
        });
    },
  );
};

export default routes;
