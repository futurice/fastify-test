import { sql } from 'slonik';
import { DateTime, SnakeToCamel, Transaction } from './utils';

class ActionTypeRow {
  id: number;
  code: string;
  name: string;
  value: number;
  cooldown: number;
  created_at: DateTime;
  updated_at: DateTime;
  is_user_action: boolean;
}

export type ActionTypeType = {
  [K in keyof ActionTypeRow as SnakeToCamel<K>]: ActionTypeRow[K];
};

export const findAllUserActions = (trx: Transaction) =>
  trx.any(sql<ActionTypeType>`
    SELECT *
    FROM action_type
    WHERE is_user_action IS TRUE;
  `);
