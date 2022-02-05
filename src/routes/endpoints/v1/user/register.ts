import { FastifyPluginAsync } from 'fastify';
import { GetType } from 'purify-ts/Codec';
import {
  ForeignKeyIntegrityConstraintViolationError,
  UniqueIntegrityConstraintViolationError,
} from 'slonik';
import { userRegistrationDTO, userRegistrationResponse } from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.post<{
    Reply: GetType<typeof userRegistrationResponse>;
    Body: GetType<typeof userRegistrationDTO>;
  }>(
    '/register',
    fastify.secureRoute.authenticated({
      schema: {
        description: 'Register a new user',
        tags: ['user'],
        body: userRegistrationDTO.schema(),
        response: {
          200: userRegistrationResponse.schema(),
        },
      },
    }),
    async (req, res) => {
      const { user } = fastify.sql;
      const result = await user.create(fastify.db, req.body).catch(err => {
        if (err instanceof ForeignKeyIntegrityConstraintViolationError) {
          throw fastify.httpErrors.notFound('No such team');
        }

        if (err instanceof UniqueIntegrityConstraintViolationError) {
          throw fastify.httpErrors.badRequest('Username reserved');
        }
        throw fastify.httpErrors.internalServerError();
      });

      return res.status(200).send(result);
    },
  );
};

export default routes;
