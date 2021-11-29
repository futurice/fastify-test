import { FastifyInstance } from 'fastify';
import { expect } from 'chai';

import { build } from '../src/app';

describe('Health check', () => {
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

  it('should succeed', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).to.equal(200);
  });
});
