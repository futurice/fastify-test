import { FastifyInstance } from 'fastify';
import { expect } from 'chai';
import { sql } from 'slonik';

import { getPool } from '../src/plugins/db';
import { build } from '../src/app';
import { ActionType } from '../src/routes/endpoints/v1/action/schemas';

import { createAction, getFeeds } from './utils/endpoints';

describe('Action endpoint', () => {
  let server: FastifyInstance;

  before(() => {
    server = build(
      {
        logger: { prettyPrint: true },
      },
      false,
    );
  });

  after(async () => {
    await server.close();
  });

  beforeEach(async () => {
    const pool = getPool();
    await pool.query(sql`TRUNCATE comment, action, feed_item`);
  });

  it.only('should generate a new feed item when sending a text message', async () => {
    const createActionResponse = await createAction(server, {
      imageData: '',
      text: 'Test message text',
      type: ActionType.TEXT,
    });

    expect(createActionResponse.statusCode).to.equal(200);

    const getFeedResponse = await getFeeds(server);

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
      },
    });
  });

  it('should generate a new feed item when sending an image message', async () => {
    const createActionResponse = await createAction(server, {
      imageData: '',
      text: 'Test message text',
      type: ActionType.IMAGE,
    });

    expect(createActionResponse.statusCode).to.equal(200);

    const getFeedResponse = await getFeeds(server);

    expect(getFeedResponse.statusCode).to.equal(200);

    const feedItems = getFeedResponse.json();
    expect(feedItems.length).to.equal(1);
    expect(feedItems[0].uuid).to.be.a('string');
    expect(feedItems[0].createdAt).to.be.a('string');
    expect(feedItems[0].updatedAt).to.be.a('string');
    expect(feedItems[0]).to.deep.include({
      type: 'IMAGE',
      text: 'Test message text',
      image: null,
      isSticky: false,
      commentCount: 0,
      author: {
        name: 'hessu',
        guild: 'TiTe',
      },
    });
  });
});
