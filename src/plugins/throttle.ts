import {
  preHandlerAsyncHookHandler,
  FastifyInstance,
  FastifyPluginAsync,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { EitherAsync } from 'purify-ts';
import { ActionType, CreateActionInput } from '../routes/v1/action/schemas';

const key = (uuid: string, action: ActionType) => `${uuid}:${action}`;

type CooldownCache = Record<ActionType, number>;

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

export const markActionDone = async (instance: FastifyInstance) => {
  const cache = await EitherAsync(() => {
    const query = instance.sql.actionType.findAllUserActions();
    return instance.db.any(query);
  })
    .map(actionTypes =>
      actionTypes.reduce((acc, actionType) => {
        acc[actionType.code as ActionType] = actionType.cooldown;
        return acc;
      }, {} as CooldownCache),
    )
    .caseOf({
      Right: result => result,
      Left: err => {
        throw new Error(`Failed to load action types in-memory: ${err}`);
      },
    });

  return async (uuid: string, action: ActionType) => {
    const redisQuery = instance.redis.set(
      key(uuid, action),
      '', // Actual value does not matter
      'PX', // MS
      cache[action],
    );
    return EitherAsync(() => redisQuery).map(result => result === 'OK');
  };
};

const plugin: FastifyPluginAsync = async instance => {
  const throttle = {
    markActionDone: await markActionDone(instance),
    canDoAction: canDoAction(instance),
  };

  instance.decorate('throttle', throttle);
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
