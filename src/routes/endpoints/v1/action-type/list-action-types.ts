import { FastifyPluginAsync } from 'fastify';
import { GetType } from 'purify-ts/Codec';
import { ActionTypeResponse } from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.get<{
    Reply: GetType<typeof ActionTypeResponse>;
  }>(
    '/',
    fastify.secureRoute.authenticated({
      schema: {
        description: 'Lists supported action types',
        tags: ['action-type'],
        response: {
          200: ActionTypeResponse.schema(),
        },
      },
    }),
    async (req, res) => {
      const { actionType } = fastify.sql;
      const result = await actionType
        .findAllUserActions(fastify.db)
        .map(result => result.slice())
        .mapLeft(err => {
          req.log.error(`Error getting action types: ${err}`);
          throw fastify.httpErrors.internalServerError();
        });

      return res.status(200).send(result.extract());
    },
  );
};

export default routes;
