import { FastifyPluginAsync } from 'fastify';
import { GetType } from 'purify-ts/Codec';
import { FeedOneResponse, GetFeedItemParams } from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.get<{
    Params: GetType<typeof GetFeedItemParams>;
    Reply: GetType<typeof FeedOneResponse>;
  }>(
    '/:feedItemUuid',
    fastify.secureRoute.authenticated({
      schema: {
        params: GetFeedItemParams.schema(),
        description: 'A single feed item and related comments',
        tags: ['feed'],
        response: {
          200: FeedOneResponse.schema(),
        },
      },
    }),
    async (req, res) => {
      const { feedItem } = fastify.sql;

      const result = await feedItem
        .findOne(fastify.db, req.params.feedItemUuid)
        .map(response => res.status(200).send(response))
        .mapLeft(err => {
          req.log.error(`Error getting feed item: ${err}`);
          throw fastify.httpErrors.internalServerError();
        });

      return result.extract();
    },
  );
};

export default routes;
