import { FastifyPluginAsync } from 'fastify';
import { GetType } from 'purify-ts/Codec';
import { CreateActionInput, CreateActionResponse } from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.post<{
    Reply: GetType<typeof CreateActionResponse>;
    Body: GetType<typeof CreateActionInput>;
  }>(
    '/',
    fastify.secureRoute.user({
      schema: {
        description: 'Create action',
        tags: ['action'],
        response: {
          200: CreateActionResponse.schema(),
        },
        body: CreateActionInput.schema(),
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
