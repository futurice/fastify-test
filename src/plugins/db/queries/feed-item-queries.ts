import { sql } from 'slonik';
import { DateTime, SnakeToCamel, camelToSnakeCase } from '../utils';

export type FeedItemTypes = 'IMAGE' | 'TEXT';

class FeedItemRow {
  id: number;
  uuid: string;
  user_id: number;
  action_type_id: number;
  image: string | null;
  text: string | null;
  aggregate: boolean;
  created_at: DateTime;
  updated_at: DateTime;
  is_banned: boolean;
  is_sticky: boolean;
  type: FeedItemTypes;
}

type FeedItemType = {
  [K in keyof FeedItemRow as SnakeToCamel<K>]: FeedItemRow[K];
};

type CreateFeedItemInput = {
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

type FindFeedItemType = FeedItemType & {
  author: string;
  authorGuild: string;
};

export const findAll = (limit: number) => {
  return sql<FindFeedItemType>`
    SELECT
      feed_item.*,
      users.name AS author,
      guild.name AS author_guild
    FROM feed_item
    LEFT JOIN users ON feed_item.user_id = users.id
    LEFT JOIN guild ON users.team_id = guild.id
    LIMIT ${limit};
  `;
};
