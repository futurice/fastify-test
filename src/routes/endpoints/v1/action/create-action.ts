import { FastifyPluginAsync } from 'fastify';
import { GetType } from 'purify-ts/Codec';
import { ActionType as ActionRowType } from '../../../../queries/action-queries';
import { createActionDTO, createActionResponse, ActionType } from './schemas';
import { uploadImage } from '../../../../utils/imageUtil';

const routes: FastifyPluginAsync = async fastify => {
  fastify.post<{
    Reply: GetType<typeof createActionResponse>;
    Body: GetType<typeof createActionDTO>;
  }>(
    '/',
    fastify.secureRoute.user({
      preHandler: fastify.throttle.canDoAction,
      schema: {
        description: 'Create action',
        tags: ['action'],
        response: {
          200: createActionResponse.schema(),
        },
        body: createActionDTO.schema(),
      },
    }),
    (req, res) => {
      return fastify.db.transaction(async trx => {
        const { action: actionQuery, feedItem: feedItemQuery } = fastify.sql;
        const { type } = req.body;

        const getTextComponent = (action: GetType<typeof createActionDTO>) => {
          switch (action.type) {
            case ActionType.IMAGE:
            case ActionType.TEXT:
              return action.text ?? null;
            case ActionType.SIMA:
              return null;
          }
        };

        // Generates a feeditem, if action type should result in one.
        const createFeedItem = (newAction: ActionRowType) => {
          return type === ActionType.IMAGE || type === ActionType.TEXT
            ? feedItemQuery.create(trx, {
                type,
                actionId: newAction.id,
                text: req.body.text,
                userId: req.user.id,
              })
            : null;
        };

        const action = await actionQuery.create(trx, {
          userId: req.user.id,
          text: getTextComponent(req.body),
          actionTypeCode: type,
        });

        const feedItem = await createFeedItem(action);

        if (feedItem != null && req.body.type === 'IMAGE') {
          uploadImage(req.body.imageData, feedItem.uuid);
        }

        await fastify.throttle.markActionDone(req.user.uuid, type);

        return res.status(200).send({ success: true });
      });
    },
  );
};

export default routes;
