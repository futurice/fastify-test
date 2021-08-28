import {
  FastifyPluginAsync,
  FastifyInstance,
  RouteShorthandOptions,
} from 'fastify';
import { preHandlerHookHandler } from 'fastify/types/hooks';
import { get, set } from 'lodash/fp';
import { TObject, TAny, Type, TProperties } from '@sinclair/typebox';
import fastifyPlugin from 'fastify-plugin';
import { NotFoundError } from 'slonik';
import fastifyAuth from 'fastify-auth';
import { UserType } from '../plugins/db/queries/user-queries';

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

const verifyToken = (
  instance: FastifyInstance,
  opts: ITokenPluginOpts,
): preHandlerHookHandler => (req, res, done) => {
  const token = req.headers['x-api-token'];
  if (token !== opts.token) {
    throw instance.httpErrors.unauthorized();
  }

  done();
};

const verifyUser = (instance: FastifyInstance): preHandlerHookHandler => async (
  req,
  res,
  done,
) => {
  const userUuid = req.headers['x-user-uuid'];

  if (typeof userUuid !== 'string') {
    throw instance.httpErrors.unauthorized();
  }

  const user = await req.db.one(req.sql.user.findById(userUuid)).catch(err => {
    if (err instanceof NotFoundError) {
      throw instance.httpErrors.unauthorized();
    }

    throw instance.httpErrors.internalServerError();
  });

  req.user = user;

  done();
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
    instance.decorateRequest('user', {});

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

  interface FastifyRequest {
    user: UserType;
  }
}

export default authPlugin;
