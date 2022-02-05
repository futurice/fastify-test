import { sql } from 'slonik';
import {
  DateTime,
  SnakeToCamel,
  Transaction,
  camelToSnakeCase,
  query,
} from './utils';

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

export const create = query((trx: Transaction, input: CreateFeedItemInput) => {
  const columns = Object.keys(input)
    .map(key => camelToSnakeCase(key))
    .map(column => sql.identifier([column]));

  const values = Object.values(input).map(value =>
    value !== undefined ? value : null,
  );

  return trx.one(sql<FeedItemType>`
    INSERT INTO feed_item(${sql.join(columns, sql`, `)})
    VALUES (${sql.join(values, sql`, `)})
    RETURNING *;
  `);
});

type FindFeedItemType = FeedItemType & {
  commentCount: number;
  author: {
    name: string;
    guild: string;
  };
};

export const findAll = query((trx: Transaction, limit: number) => {
  return trx.any(sql<FindFeedItemType>`
    SELECT
      feed_item.*,
      users.name AS author,
      guild.name AS author_guild,
      COUNT(comment.id) AS comment_count,
      json_build_object(
        'name', users.name,
        'guild', guild.name
      ) as author
    FROM feed_item
    LEFT JOIN users ON feed_item.user_id = users.id
    LEFT JOIN guild ON users.team_id = guild.id
    LEFT JOIN comment ON feed_item.id = comment.feed_item_id
    GROUP BY
      feed_item.id,
      users.name,
      guild.name
    LIMIT ${limit};
  `);
});

type FindOneFeedItemType = FeedItemType & {
  author: {
    name: string;
    guild: string;
  };
  comments: {
    uuid: string;
    text: string;
    author: {
      name: string;
      guild: string;
    };
    createdAt: string;
  }[];
};

export const findOne = query((trx: Transaction, uuid: string) => {
  return trx.one(sql<FindOneFeedItemType>`
    WITH comment_cte AS (
      SELECT
        comment.uuid,
        comment.text,
        comment.feed_item_id,
        json_build_object(
          'name', users.name,
          'guild', guild.name
        ) as author,
        comment.created_at
      FROM comment
      LEFT JOIN feed_item ON feed_item.id = comment.feed_item_id
      LEFT JOIN users ON users.id = comment.user_id
      LEFT JOIN guild ON guild.id = users.team_id
      WHERE feed_item.uuid = ${uuid}
    )
    SELECT
      feed_item.*,
      json_build_object(
        'name', users.name,
        'guild', guild.name
      ) as author,
      json_agg(
        json_build_object(
          'uuid', comment_cte.uuid,
          'text', comment_cte.text,
          'author', comment_cte.author,
          'createdAt', comment_cte.created_at
        )
      ) as comments
    FROM feed_item
    LEFT JOIN users ON feed_item.user_id = users.id
    LEFT JOIN guild ON users.team_id = guild.id
    LEFT JOIN comment_cte ON comment_cte.feed_item_id = feed_item.id
    WHERE feed_item.uuid = ${uuid}
    GROUP BY
      feed_item.id,
      users.name,
      guild.name
  `);
});
