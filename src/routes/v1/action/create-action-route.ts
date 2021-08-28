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
        const { imageData, text, type } = req.body;

        return trx
          .one(
            req.sql.action.create({
              userId: 1,
              imagePath: imageData ?? null,
              text: text ?? null,
              actionTypeCode: type,
            }),
          )
          .then(action => {
            switch (type) {
              case ActionType.IMAGE:
              case ActionType.TEXT:
                return trx.one(
                  req.sql.feedItem.create({
                    type,
                    actionId: action.id,
                    text,
                    userId: req.user.id,
                    // imagePath,
                  }),
                );
              case ActionType.SIMA:
                // Above actions do not generate
                // feed items on creation.
                return;
              default:
                req.log.error('Un-implemented action type handler');
                throw fastify.httpErrors.internalServerError();
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
