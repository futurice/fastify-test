import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Users } from '@prisma/client';
import * as yup from 'yup';

interface ITokenPluginOpts {
  token: string;
}

const userHeaderSchema = yup.object().shape({
  'x-user-uuid': yup.string().uuid().required(),
});

const tokenHeaderSchema = yup.object().shape({
  'x-api-token': yup.string().required(),
});

const validateSchema = (schema: yup.AnySchema, obj: unknown) =>
  schema.validate(obj);

const authPlugin: FastifyPluginAsync<ITokenPluginOpts> = fastifyPlugin(
  async (instance, opts) => {
    const validateToken = (req: FastifyRequest) => {
      return validateSchema(tokenHeaderSchema, req.headers)
        .catch(err => {
          if (err instanceof yup.ValidationError) {
            throw instance.httpErrors.unauthorized(err.errors.join(', '));
          }
          instance.log.warn('Unexpected validation error', err);

          throw instance.httpErrors.internalServerError();
        })
        .then(result => {
          if (result['x-api-token'] === opts.token) {
            return;
          }

          throw instance.httpErrors.unauthorized('Incorrect api token ');
        });
    };

    const validateUser = (req: FastifyRequest) => {
      return validateSchema(userHeaderSchema, req.headers)
        .catch(err => {
          if (err instanceof yup.ValidationError) {
            throw instance.httpErrors.badRequest(err.errors.join(', '));
          }
          instance.log.warn('Unexpected validation error', err);

          throw instance.httpErrors.internalServerError();
        })
        .then(result => {
          return instance.prisma.users.findUnique({
            where: { uuid: result['x-user-uuid'] },
          });
        });
    };

    instance.decorate('auth', {
      validateToken,
      validateUser,
    });
  },
);

declare module 'fastify' {
  interface FastifyInstance {
    auth: {
      validateToken: (req: FastifyRequest) => Promise<void>;
      validateUser: (req: FastifyRequest) => Promise<Users | null>;
    };
  }
}

export default authPlugin;
