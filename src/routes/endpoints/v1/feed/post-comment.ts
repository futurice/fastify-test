import { FastifyPluginAsync } from 'fastify';
import { GetType } from 'purify-ts/Codec';
import { ForeignKeyIntegrityConstraintViolationError } from 'slonik';
import {
  CreateCommentResponse,
  CreateCommentInput,
  CreateCommentParams,
} from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.post<{
    Reply: GetType<typeof CreateCommentResponse>;
    Params: GetType<typeof CreateCommentParams>;
    Body: GetType<typeof CreateCommentInput>;
  }>(
    '/:feedItemUuid/comment',
    fastify.secureRoute.user({
      schema: {
        description: 'Post a comment to a feed item',
        tags: ['feed'],
        params: CreateCommentParams.schema(),
        body: CreateCommentInput.schema(),
        response: {
          200: CreateCommentResponse.schema(),
        },
      },
    }),
    async (req, res) => {
      const { feedItemUuid } = req.params;
      const { comment } = fastify.sql;

      return await comment
        .create(fastify.db, {
          feedItemUuid,
          userId: req.user.id,
          ...req.body,
        })
        .caseOf({
          Right: result => res.status(200).send(result),
          Left: err => {
            if (!(err instanceof ForeignKeyIntegrityConstraintViolationError)) {
              throw fastify.httpErrors.notFound('Feed item does not exist');
            }

            throw fastify.httpErrors.internalServerError();
          },
        });
    },
  );
};

export default routes;
