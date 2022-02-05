import { sql } from 'slonik';
import { DateTime, SnakeToCamel, Transaction } from './utils';

class ActionRow {
  id: number;
  user_id: number;
  action_type_id: number;
  text: string | null;
  aggregate: boolean;
  created_at: DateTime;
  updated_at: DateTime;
  is_banned: boolean;
}

export type ActionType = {
  [K in keyof ActionRow as SnakeToCamel<K>]: ActionRow[K];
};

export type CreateActionInput = {
  userId: number;
  actionTypeCode: string;
  text: string | null;
};

export const create = (
  trx: Transaction,
  { userId, actionTypeCode, text }: CreateActionInput,
) =>
  trx.one(sql<ActionType>`
      INSERT INTO action("user_id", "action_type_id", "text")
      VALUES (${userId}, (SELECT id FROM action_type WHERE code = ${actionTypeCode}), ${text})
      RETURNING *;
    `);
