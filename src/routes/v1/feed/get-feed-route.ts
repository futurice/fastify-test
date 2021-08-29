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
        response: {
          200: FeedResponse.schema(),
        },
      },
    }),
    async (req, res) => {
      const result = await req.db.any(req.sql.feedItem.findAll());
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
