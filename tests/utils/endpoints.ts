import { FastifyInstance, LightMyRequestResponse } from 'fastify';
import { GetType } from 'purify-ts/Codec';

import config from '../../src/config';
import { CreateActionInput } from '../../src/routes/endpoints/v1/action/schemas';

export const TEST_USER = 'fef01237-6f6a-4b12-83b5-18874624ba54';

export const HEADERS = {
  'x-api-token': config.TOKEN,
  'x-user-uuid': TEST_USER,
};

export async function createAction(
  server: FastifyInstance,
  action: GetType<typeof CreateActionInput>,
): Promise<LightMyRequestResponse> {
  return await server.inject({
    method: 'POST',
    url: '/api/v1/action/',
    headers: HEADERS,
    payload: action,
  });
}

export async function getFeeds(
  server: FastifyInstance,
): Promise<LightMyRequestResponse> {
  return await server.inject({
    method: 'GET',
    url: '/api/v1/feed/',
    headers: HEADERS,
  });
}
