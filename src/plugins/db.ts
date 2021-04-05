import { FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import knex, { Knex } from 'knex';
import { opts } from '../knexfile';

const plugin: FastifyPluginAsync = async instance => {
  const connection = knex(opts.config);
  return connection.migrate.latest().then(() => {
    instance
      .decorate('knex', connection)
      .addHook('onClose', async (_, done) => {
        await connection.destroy();
        done();
      });
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    knex: Knex;
  }
}

export default fastifyPlugin(plugin);
