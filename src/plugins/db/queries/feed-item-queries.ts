import { sql } from 'slonik';
import { DateTime, SnakeToCamel, camelToSnakeCase } from '../utils';

type FeedItemTypes = 'IMAGE' | 'TEXT';

class FeedItemRow {
  id: number;
  user_id: number;
  action_type_id: number;
  image_path: string | null;
  text: string | null;
  aggregate: boolean;
  created_at: DateTime;
  updated_at: DateTime;
  is_banned: boolean;
}

export type FeedItemType = {
  [K in keyof FeedItemRow as SnakeToCamel<K>]: FeedItemRow[K];
};

export type CreateFeedItemInput = {
  actionId?: number;
  userId?: number;
  text?: string;
  image?: string;
  type: FeedItemTypes;
};

export const create = (input: CreateFeedItemInput) => {
  const columns = Object.keys(input)
    .map(key => camelToSnakeCase(key))
    .map(column => sql.identifier([column]));

  const values = Object.values(input);

  return sql<FeedItemType>`
    INSERT INTO feed_item(${sql.join(columns, sql`, `)})
    VALUES (${sql.join(values, sql`, `)})
    RETURNING *;
  `;
};
