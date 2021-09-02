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
      const limit = req.query.limit ?? 50;
      const { feedItem } = fastify.sql;
      const result = await fastify.db.any(feedItem.findAll(limit));
      const response = result.map(({ author, authorGuild, ...rest }) => ({
        ...rest,
        author: {
          name: author,
          guild: authorGuild,
        },
      }));
      res.status(200).send(response);
    },
  );
};

export default routes;
