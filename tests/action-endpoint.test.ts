import { FastifyInstance } from 'fastify';
import { expect } from 'chai';

import { build } from '../src/app';
import config from '../src/config';
import { ActionType } from '../src/routes/endpoints/v1/action/schemas';

describe('Action endpoint', () => {
  let server : FastifyInstance;

  before(() => {
    server = build({
      logger: { prettyPrint: true },
    }, false);
  });

  after(async () => {
    await server.close();
  })

  it.only('should generate a new feed item when sending a message', async () => {
    const createActionResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/action/',
      headers: {
        'x-api-token': config.TOKEN,
      },
      payload: {
        text: 'Test message text',
        type: ActionType.TEXT,
      },
    });

    expect(createActionResponse.statusCode).to.equal(200);

    const getFeedResponse = await server.inject({
      method: 'GET',
      url: '/api/v1/feed/',
      headers: {
        'x-api-token': config.TOKEN,
      },
    });

    expect(getFeedResponse.statusCode).to.equal(200);
    const feedItems = getFeedResponse.json();
    console.log(JSON.stringify(feedItems));
  });
});
