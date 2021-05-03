import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import * as yup from 'yup';

const userHeaderSchema = yup.object().shape({
  'x-api-token': yup.string().required(),
});

interface ITokenPluginOpts {
  token: string;
}

const validate = (obj: unknown) => userHeaderSchema.validate(obj);

const authPlugin: FastifyPluginAsync<ITokenPluginOpts> = fastifyPlugin(
  async (instance, opts) => {
    const validateRequest = (req: FastifyRequest) => {
      return validate(req.headers)
        .catch(err => {
          if (err instanceof yup.ValidationError) {
            throw instance.httpErrors.unauthorized(err.errors.join(', '));
          }
          instance.log.warn('Unexpected validation error', err);

          throw instance.httpErrors.internalServerError();
        })
        .then(result => {
          if (result['x-api-token'] === opts.token) {
            // TODO User object
            return {};
          }

          throw instance.httpErrors.unauthorized('Incorrect api token ');
        });
    };

    instance.decorate('auth', {
      validateRequest,
    });
  },
);

declare module 'fastify' {
  interface FastifyInstance {
    auth: {
      validateRequest: typeof validate;
    };
  }
}

export default authPlugin;
