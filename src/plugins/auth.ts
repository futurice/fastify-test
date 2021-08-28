import {
  FastifyPluginAsync,
  FastifyRequest,
  FastifyInstance,
  RouteShorthandOptions,
} from 'fastify';
import { preHandlerHookHandler } from 'fastify/types/hooks';
import { get, set } from 'lodash/fp';
import { TObject, TAny, Type, TProperties } from '@sinclair/typebox';
import fastifyPlugin from 'fastify-plugin';
import { NotFoundError } from 'slonik';
import fastifyAuth from 'fastify-auth';

interface ITokenPluginOpts {
  token: string;
}

const userHeaderSchema = Type.Object({
  'x-user-uuid': Type.Readonly(Type.String()),
});

const tokenHeaderSchema = Type.Object({
  'x-api-token': Type.Readonly(Type.String()),
});

type AuthRoute = (opts: RouteShorthandOptions) => RouteShorthandOptions;

const verifyToken = (instance: FastifyInstance, opts: ITokenPluginOpts) => (
  req: FastifyRequest,
) => {
  const token = req.headers['x-api-token'];
  if (token !== opts.token) {
    throw instance.httpErrors.unauthorized();
  }
};

const verifyUser = (instance: FastifyInstance) => (req: FastifyRequest) => {
  const userUuid = req.headers['x-user-uuid'];

  if (typeof userUuid !== 'string') {
    throw instance.httpErrors.unauthorized();
  }

  const user = req.db.one(req.sql.user.findById(userUuid)).catch(err => {
    throw instance.httpErrors.unauthorized();
  });
};

const mergeOpts = (
  opts: RouteShorthandOptions,
  securityHeaders: TObject<TProperties>[],
  authHook: preHandlerHookHandler,
): RouteShorthandOptions => {
  let mergedOpts = { ...opts };

  const headers =
    (get(['schema', 'headers'], mergedOpts) as TObject<TAny>) ??
    Type.Object({});

  const mergedHeaders = Type.Intersect([headers, ...securityHeaders]);

  mergedOpts = set(['schema', 'headers'], mergedHeaders, mergedOpts);

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
    await instance.register(fastifyAuth);

    const secureRoute: FastifyInstance['secureRoute'] = {
      authenticated: (opts: RouteShorthandOptions) =>
        mergeOpts(
          opts,
          [tokenHeaderSchema],
          instance.auth([verifyToken(instance, pluginOpts)]),
        ),
      user: (opts: RouteShorthandOptions) =>
        mergeOpts(
          opts,
          [tokenHeaderSchema, userHeaderSchema],
          instance.auth(
            [verifyToken(instance, pluginOpts), verifyUser(instance)],
            {
              relation: 'and',
            },
          ),
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
}

export default authPlugin;
