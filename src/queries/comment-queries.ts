import { sql } from 'slonik';
import { DateTime, SnakeToCamel, Transaction } from './utils';

export type FeedItemTypes = 'IMAGE' | 'TEXT';

class CommentRow {
  id: number;
  uuid: string;
  user_id: number;
  feed_item_id: number;
  text: string | null;
  created_at: DateTime;
  updated_at: DateTime;
}

type CommentType = {
  [K in keyof CommentRow as SnakeToCamel<K>]: CommentRow[K];
};

type CommentDTO = {
  userId: number;
  feedItemUuid: string;
  text: string;
};

export const create = (trx: Transaction, input: CommentDTO) => {
  const { userId, text, feedItemUuid } = input;
  return trx.one(sql<CommentType>`
    INSERT INTO comment(user_id, text, feed_item_id)
    VALUES (${userId}, ${text}, (SELECT id FROM feed_item WHERE uuid = ${feedItemUuid}))
    RETURNING *;
  `);
};
