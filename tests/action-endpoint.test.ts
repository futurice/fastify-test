import { FastifyInstance } from 'fastify';
import { expect } from 'chai';
import { sql } from 'slonik';

import { getPool } from '../src/plugins/db';
import { build } from '../src/app';
import config from '../src/config';
import { ActionType } from '../src/routes/endpoints/v1/action/schemas';

const TEST_USER = 'fef01237-6f6a-4b12-83b5-18874624ba54';

describe('Action endpoint', () => {
  let server : FastifyInstance;

  before(async () => {
    const pool = getPool();
    await pool.query(sql`TRUNCATE comment, action, feed_item`);
  
    server = build({
      logger: { prettyPrint: true },
    }, false);
  });

  after(async () => {
    await server.close();
  })

  it('should generate a new feed item when sending a message', async () => {
    const createActionResponse = await server.inject({
      method: 'POST',
      url: '/api/v1/action/',
      headers: {
        'x-api-token': config.TOKEN,
        'x-user-uuid': TEST_USER,
      },
      payload: {
        text: 'Test message text',
        type: ActionType.TEXT,
      },
    });

    console.log(createActionResponse.json());

    expect(createActionResponse.statusCode).to.equal(200);

    const getFeedResponse = await server.inject({
      method: 'GET',
      url: '/api/v1/feed/',
      headers: {
        'x-api-token': config.TOKEN,
        'x-user-uuid': TEST_USER,
      },
    });

    expect(getFeedResponse.statusCode).to.equal(200);
  
    const feedItems = getFeedResponse.json();
    expect(feedItems.length).to.equal(1);
    expect(feedItems[0].uuid).to.be.a('string');
    expect(feedItems[0].createdAt).to.be.a('string');
    expect(feedItems[0].updatedAt).to.be.a('string');
    expect(feedItems[0]).to.deep.include({
      type: 'TEXT',
      text: 'Test message text',
      image: null,
      isSticky: false,
      commentCount: 0,
      author: {
        name: 'hessu',
        guild: 'TiTe',
      }
    })
  });
});
