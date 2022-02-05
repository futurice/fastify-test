import { FastifyPluginAsync } from 'fastify';
import { GetType } from 'purify-ts/Codec';
import { FeedResponse, FeedQuery } from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.get<{
    Querystring: GetType<typeof FeedQuery>;
    Reply: GetType<typeof FeedResponse>;
  }>(
    '/',
    fastify.secureRoute.authenticated({
      schema: {
        description: 'Main feed content',
        tags: ['feed'],
        querystring: FeedQuery.schema(),
        response: {
          200: FeedResponse.schema(),
        },
      },
    }),
    async (req, res) => {
      const { feedItem } = fastify.sql;
      const { limit } = req.query;

      const result = await feedItem
        .findAll(fastify.db, limit)
        .map(response => response.slice())
        .mapLeft(err => {
          req.log.error(`Error getting feed: ${err}`);
          throw fastify.httpErrors.internalServerError();
        });

      return res.status(200).send(result.extract());
    },
  );
};

export default routes;
