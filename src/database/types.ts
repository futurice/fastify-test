/* eslint-disable @typescript-eslint/no-empty-interface */
import { Knex } from 'knex';
import { Static } from '@sinclair/typebox';
import { FeedItemSchema } from './modelSchemas';

declare module 'knex/types/tables' {
  interface Feed extends Static<typeof FeedItemSchema> {}

  interface Tables {
    feed_items: Knex.CompositeTableType<
      Feed,
      Pick<Feed, 'content'> & Partial<Pick<Feed, 'created_at' | 'updated_at'>>,
      Partial<Omit<Feed, 'id'>>
    >;
  }
}
