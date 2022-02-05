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
      await actionType
        .findAllUserActions(fastify.db)
        .ifRight(result => res.status(200).send(result.slice()))
        .ifLeft(err => {
          req.log.error(`Error getting action types: ${err}`);
          return res.internalServerError();
        });
    },
  );
};

export default routes;
