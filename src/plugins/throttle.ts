import {
  preHandlerAsyncHookHandler,
  FastifyInstance,
  FastifyPluginAsync,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
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

  const result = await instance.redis
    .exists(key(req.user.uuid, body.type))
    .catch(err => {
      instance.log.error(`Error checing action validity ${err}`);
      throw instance.httpErrors.internalServerError();
    });

  if (result === 1) {
    throw instance.httpErrors.forbidden('Cooldown active');
  }

  return true;
};

type MarkActionTypeType = (
  uuid: string,
  action: ActionType,
) => Promise<boolean>;

export const markActionDone = async (
  instance: FastifyInstance,
): Promise<MarkActionTypeType> => {
  const { actionType } = instance.sql;

  const actionTypeCooldowns = await actionType
    .findAllUserActions(instance.db)
    .then(actionTypes =>
      actionTypes.reduce((acc, actionType) => {
        acc[actionType.code as ActionType] = actionType.cooldown;
        return acc;
      }, {} as CooldownCache),
    )
    .catch(err => {
      throw new Error(`Failed to load action types in-memory: ${err}`);
    });

  return async (uuid, action) => {
    const result = await instance.redis.set(
      key(uuid, action),
      '', // Actual value does not matter
      'PX', // MS
      actionTypeCooldowns[action],
    );

    return result === 'OK';
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
