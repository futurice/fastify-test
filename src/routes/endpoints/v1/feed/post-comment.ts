import { FastifyPluginAsync } from 'fastify';
import { GetType } from 'purify-ts/Codec';
import { ForeignKeyIntegrityConstraintViolationError } from 'slonik';
import {
  createCommentResponse,
  createCommentDTO,
  createCommentParams,
} from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.post<{
    Reply: GetType<typeof createCommentResponse>;
    Params: GetType<typeof createCommentParams>;
    Body: GetType<typeof createCommentDTO>;
  }>(
    '/:feedItemUuid/comment',
    fastify.secureRoute.user({
      schema: {
        description: 'Post a comment to a feed item',
        tags: ['feed'],
        params: createCommentParams.schema(),
        body: createCommentDTO.schema(),
        response: {
          200: createCommentResponse.schema(),
        },
      },
    }),
    async (req, res) => {
      const { feedItemUuid } = req.params;
      const { comment } = fastify.sql;

      const result = await comment
        .create(fastify.db, {
          feedItemUuid,
          userId: req.user.id,
          ...req.body,
        })
        .catch(err => {
          if (!(err instanceof ForeignKeyIntegrityConstraintViolationError)) {
            throw fastify.httpErrors.notFound('Feed item does not exist');
          }

          throw fastify.httpErrors.internalServerError();
        });

      return res.status(200).send(result);
    },
  );
};

export default routes;
