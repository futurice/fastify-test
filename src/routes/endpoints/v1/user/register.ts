import { FastifyPluginAsync } from 'fastify';
import { GetType } from 'purify-ts/Codec';
import {
  ForeignKeyIntegrityConstraintViolationError,
  UniqueIntegrityConstraintViolationError,
} from 'slonik';
import { userRegistration, userRegistrationResponse } from './schemas';

const routes: FastifyPluginAsync = async fastify => {
  fastify.post<{
    Reply: GetType<typeof userRegistrationResponse>;
    Body: GetType<typeof userRegistration>;
  }>(
    '/register',
    fastify.secureRoute.authenticated({
      schema: {
        description: 'Register a new user',
        tags: ['user'],
        body: userRegistration.schema(),
        response: {
          200: userRegistrationResponse.schema(),
        },
      },
    }),
    async (req, res) => {
      const { user } = fastify.sql;
      await user
        .create(fastify.db, req.body)
        .ifRight(result => res.send(result))
        .mapLeft(err => {
          if (err instanceof ForeignKeyIntegrityConstraintViolationError) {
            return res.notFound('No such team');
          }

          if (err instanceof UniqueIntegrityConstraintViolationError) {
            return res.badRequest('Username reserved');
          }
          return res.internalServerError();
        });
    },
  );
};

export default routes;
