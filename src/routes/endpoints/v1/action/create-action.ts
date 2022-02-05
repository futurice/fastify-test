import { FastifyPluginAsync } from 'fastify';
import { EitherAsync } from 'purify-ts';
import { GetType } from 'purify-ts/Codec';
import { ActionType as ActionRowType } from '../../../../queries/action-queries';
import { CreateActionInput, CreateActionResponse, ActionType } from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.post<{
    Reply: GetType<typeof CreateActionResponse>;
    Body: GetType<typeof CreateActionInput>;
  }>(
    '/',
    fastify.secureRoute.user({
      preHandler: fastify.throttle.canDoAction,
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
      return fastify.db.transaction(async trx => {
        // TODO Upload image, if IMAGE action.
        const { action, feedItem } = fastify.sql;
        const { imageData, text, type } = req.body;

        const createAction = action.create(trx, {
          userId: req.user.id,
          imagePath: imageData ?? null,
          text: text ?? null,
          actionTypeCode: type,
        });

        // Generates a feeditem, if action type should result in one.
        const generateFeedItem = (newAction: ActionRowType) =>
          EitherAsync(async () => {
            if (type === ActionType.IMAGE || type === ActionType.TEXT) {
              await feedItem.create(trx, {
                type,
                actionId: newAction.id,
                text,
                userId: req.user.id,
                // imagePath,
              });
            }
            return newAction;
          });

        const markDone = () =>
          EitherAsync(() =>
            fastify.throttle.markActionDone(req.user.uuid, type),
          );

        const result = await createAction
          .chain(generateFeedItem)
          .chain(markDone)
          .map(() => ({ success: true }))
          .mapLeft(err => {
            req.log.error(`Error creating action: ${err}`);
            throw fastify.httpErrors.internalServerError();
          });

        return res.status(200).send(result.extract());
      });
    },
  );
};

export default routes;
