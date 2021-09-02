import {
  FastifyPluginCallback,
  preHandlerAsyncHookHandler,
  FastifyInstance,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { EitherAsync } from 'purify-ts';
import { ActionType, CreateActionInput } from '../routes/v1/action/schemas';

const key = (uuid: string, action: ActionType) => `${uuid}:${action}`;

export const canDoAction: (
  instance: FastifyInstance,
) => preHandlerAsyncHookHandler = instance => async req => {
  const body = CreateActionInput.decode(req.body).caseOf({
    Right: result => result,
    Left: err => {
      instance.log.error(`Unexpected canDoAction input: ${err}`);
      throw instance.httpErrors.internalServerError();
    },
  });

  const redisQuery = instance.redis.exists(key(req.user.uuid, body.type));
  return await EitherAsync(() => redisQuery)
    .map(result => result === 1)
    .caseOf({
      Right: exists => {
        if (exists) {
          throw instance.httpErrors.unauthorized();
        }
      },
      Left: err => {
        instance.log.error(`Error checing action validity ${err}`);
        throw instance.httpErrors.internalServerError();
      },
    });
};

export const markActionDone = (instance: FastifyInstance) => async (
  uuid: string,
  action: ActionType,
) => {
  const redisQuery = instance.redis.set(key(uuid, action), '');
  return EitherAsync(() => redisQuery).map(result => result === 'OK');
};

const plugin: FastifyPluginCallback = (instance, _, done) => {
  const throttle = {
    markActionDone: markActionDone(instance),
    canDoAction: canDoAction(instance),
  };

  instance.decorate('throttle', throttle);
  done();
};

declare module 'fastify' {
  interface FastifyInstance {
    throttle: {
      markActionDone: ReturnType<typeof markActionDone>;
      canDoAction: ReturnType<typeof canDoAction>;
    };
  }
}

export default fastifyPlugin(plugin);
