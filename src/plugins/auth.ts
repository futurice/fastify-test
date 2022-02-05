import {
  FastifyPluginAsync,
  FastifyInstance,
  RouteShorthandOptions,
} from 'fastify';
import { preHandlerHookHandler } from 'fastify/types/hooks';
import { get, set } from 'lodash/fp';
import { Codec, intersect } from 'purify-ts/Codec';
import { NonEmptyString } from 'purify-ts-extra-codec';
import fastifyPlugin from 'fastify-plugin';
import { NotFoundError } from 'slonik';
import fastifyAuth from 'fastify-auth';
import { UserType } from '../queries/user-queries';

interface ITokenPluginOpts {
  token: string;
}

const userHeaderSchema = Codec.interface({
  'x-user-uuid': NonEmptyString,
});

const tokenHeaderSchema = Codec.interface({
  'x-api-token': NonEmptyString,
});

type AuthRoute = (opts: RouteShorthandOptions) => RouteShorthandOptions;

const verifyToken = (
  instance: FastifyInstance,
  token: string,
): preHandlerHookHandler => (req, res, done) => {
  const tokenHeader = req.headers['x-api-token'];
  if (tokenHeader !== token) {
    throw instance.httpErrors.unauthorized();
  }

  done();
};

const verifyUser = (
  instance: FastifyInstance,
): preHandlerHookHandler => async req => {
  const userUuid = req.headers['x-user-uuid'];

  if (typeof userUuid !== 'string') {
    throw instance.httpErrors.unauthorized();
  }

  return instance.sql.user.findById(instance.db, userUuid).caseOf({
    Right: user => {
      req.user = user;
    },
    Left: err => {
      if (err instanceof NotFoundError) {
        throw instance.httpErrors.unauthorized();
      }

      throw instance.httpErrors.internalServerError();
    },
  });
};

const mergeOpts = (
  opts: RouteShorthandOptions,
  securityHeaders: Codec<any>[],
  authHook: preHandlerHookHandler,
): RouteShorthandOptions => {
  let mergedOpts = { ...opts };

  const headers =
    (get(['schema', 'headers'], mergedOpts) as Codec<unknown>) ??
    Codec.interface({});

  const mergedHeaders = securityHeaders.reduce(
    (acc, header) => intersect(acc, header),
    headers,
  );

  mergedOpts = set(['schema', 'headers'], mergedHeaders.schema(), mergedOpts);

  const prehandler = get(['preHandler'], mergedOpts) ?? [];

  if (Array.isArray(prehandler)) {
    prehandler.unshift(authHook);
    mergedOpts = set('preHandler', prehandler, mergedOpts);
  } else {
    mergedOpts = set('preHandler', [authHook, prehandler], mergedOpts);
  }
  return mergedOpts;
};

const authPlugin: FastifyPluginAsync<ITokenPluginOpts> = fastifyPlugin(
  async (instance, pluginOpts) => {
    const { token } = pluginOpts;
    await instance.register(fastifyAuth);
    instance.decorateRequest('user', {});

    const secureRoute: FastifyInstance['secureRoute'] = {
      authenticated: (opts: RouteShorthandOptions) =>
        mergeOpts(
          opts,
          [tokenHeaderSchema],
          instance.auth([verifyToken(instance, token)]),
        ),
      user: (opts: RouteShorthandOptions) =>
        mergeOpts(
          opts,
          [tokenHeaderSchema, userHeaderSchema],
          instance.auth([verifyToken(instance, token), verifyUser(instance)], {
            relation: 'and',
          }),
        ),
    };

    instance.decorate('secureRoute', secureRoute);
  },
);

declare module 'fastify' {
  interface FastifyInstance {
    secureRoute: {
      authenticated: AuthRoute;
      user: AuthRoute;
    };
  }

  interface FastifyRequest {
    user: UserType;
  }
}

export default authPlugin;
