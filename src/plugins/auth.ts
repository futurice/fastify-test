import { FastifyPluginAsync, FastifyRequest, FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { NotFoundError } from 'slonik';
import * as yup from 'yup';
import { findById } from '../queries/user';

interface ITokenPluginOpts {
  token: string;
}

const userHeaderSchema = yup.object().shape({
  'x-user-uuid': yup.string().uuid().required(),
});

type UserHeader = yup.Asserts<typeof userHeaderSchema>;

const tokenHeaderSchema = yup.object().shape({
  'x-api-token': yup.string().required(),
});

type TokenHeader = yup.Asserts<typeof tokenHeaderSchema>;

const validateSchema = <TResult>(schema: yup.AnySchema, obj: unknown) =>
  schema.validate(obj).then(result => result as TResult);

const validateUser = (instance: FastifyInstance) => (req: FastifyRequest) =>
  validateSchema<UserHeader>(userHeaderSchema, req.headers)
    .catch(err => {
      if (err instanceof yup.ValidationError) {
        throw instance.httpErrors.badRequest(err.errors.join(', '));
      }
      instance.log.warn('Unexpected validation error', err);

      throw instance.httpErrors.internalServerError();
    })
    .then(result => {
      return req.db.one(findById(result['x-user-uuid'])).catch(err => {
        if (err instanceof NotFoundError) {
          throw instance.httpErrors.unauthorized();
        }

        throw instance.httpErrors.internalServerError();
      });
    });

const validateToken = (instance: FastifyInstance, opts: ITokenPluginOpts) => (
  req: FastifyRequest,
) =>
  validateSchema<TokenHeader>(tokenHeaderSchema, req.headers)
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

const authPlugin: FastifyPluginAsync<ITokenPluginOpts> = fastifyPlugin(
  async (instance, opts) => {
    instance.decorate('auth', {
      validateToken: validateToken(instance, opts),
      validateUser: validateUser(instance),
    });
  },
);

declare module 'fastify' {
  interface FastifyInstance {
    auth: {
      validateToken: ReturnType<typeof validateToken>;
      validateUser: ReturnType<typeof validateUser>;
    };
  }
}

export default authPlugin;
