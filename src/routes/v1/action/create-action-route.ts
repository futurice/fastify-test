import { FastifyPluginAsync } from 'fastify';
import { GetType } from 'purify-ts/Codec';
import { CreateActionInput, CreateActionResponse, ActionType } from './schemas';

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
    (req, res) => {
      return req.db.transaction(async trx => {
        // TODO Upload image, if IMAGE action.
        const { action, feedItem } = fastify.sql;
        const { imageData, text, type } = req.body;

        return trx
          .one(
            action.create({
              userId: req.user.id,
              imagePath: imageData ?? null,
              text: text ?? null,
              actionTypeCode: type,
            }),
          )
          .then(action => {
            if (type === ActionType.IMAGE || type === ActionType.TEXT) {
              return trx.one(
                feedItem.create({
                  type,
                  actionId: action.id,
                  text,
                  userId: req.user.id,
                  // imagePath,
                }),
              );
            }
          })
          .then(() => {
            return res.status(200).send({
              success: true,
            });
          });
      });
    },
  );
};

export default routes;
