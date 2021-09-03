import { FastifyPluginAsync } from 'fastify';
import { EitherAsync } from 'purify-ts';
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
      return EitherAsync(() =>
        fastify.db.any(actionType.findAllUserActions()),
      ).caseOf({
        Left: err => {
          req.log.error(`Error getting action types: ${err}`);
          throw fastify.httpErrors.internalServerError();
        },
        Right: result => res.status(200).send(result.slice()),
      });
    },
  );
};

export default routes;
