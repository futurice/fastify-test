import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('feed_items', (table: Knex.TableBuilder) => {
    table.bigIncrements('id').primary().index();
    table.string('content');
    table
      .timestamp('created_at')
      .index()
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp('updated_at')
      .index()
      .notNullable()
      .defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('feed_items');
}
