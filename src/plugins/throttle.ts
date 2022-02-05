import {
  preHandlerAsyncHookHandler,
  FastifyInstance,
  FastifyPluginAsync,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { EitherAsync } from 'purify-ts';
import {
  ActionType,
  createActionDTO,
} from '../routes/endpoints/v1/action/schemas';

const key = (uuid: string, action: ActionType) => `${uuid}:${action}`;

type CooldownCache = Record<ActionType, number>;

export const canDoAction: (
  instance: FastifyInstance,
) => preHandlerAsyncHookHandler = instance => async req => {
  const body = createActionDTO
    .decode(req.body)
    .mapLeft(err => {
      instance.log.error(`Unexpected canDoAction input: ${err}`);
      throw instance.httpErrors.internalServerError();
    })
    .extract();

  const redisQuery = instance.redis.exists(key(req.user.uuid, body.type));
  return EitherAsync(() => redisQuery)
    .map(result => result === 1)
    .caseOf({
      Right: exists => {
        if (exists) {
          throw instance.httpErrors.forbidden('Cooldown active');
        }
      },
      Left: err => {
        instance.log.error(`Error checing action validity ${err}`);
        throw instance.httpErrors.internalServerError();
      },
    });
};

type MarkActionTypeType = (
  uuid: string,
  action: ActionType,
) => EitherAsync<unknown, boolean>;

export const markActionDone = async (
  instance: FastifyInstance,
): Promise<MarkActionTypeType> => {
  const { actionType } = instance.sql;

  const actionTypeCooldowns = (
    await actionType
      .findAllUserActions(instance.db)
      .map(actionTypes =>
        actionTypes.reduce((acc, actionType) => {
          acc[actionType.code as ActionType] = actionType.cooldown;
          return acc;
        }, {} as CooldownCache),
      )
      .mapLeft(err => {
        throw new Error(`Failed to load action types in-memory: ${err}`);
      })
  ).extract();

  return (uuid, action) => {
    const redisQuery = instance.redis.set(
      key(uuid, action),
      '', // Actual value does not matter
      'PX', // MS
      actionTypeCooldowns[action],
    );
    return EitherAsync(() => redisQuery).map(result => result === 'OK');
  };
};

const plugin: FastifyPluginAsync = async instance => {
  const throttle: ThrottlePlugin = {
    markActionDone: await markActionDone(instance),
    canDoAction: canDoAction(instance),
  };

  instance.decorate('throttle', throttle);
};

type ThrottlePlugin = {
  markActionDone: MarkActionTypeType;
  canDoAction: ReturnType<typeof canDoAction>;
};

declare module 'fastify' {
  interface FastifyInstance {
    throttle: ThrottlePlugin;
  }
}

export default fastifyPlugin(plugin);
