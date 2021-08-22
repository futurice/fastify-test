import { sql } from 'slonik';
import { DateTime } from '../utils';
import { SnakeToCamel, select } from '../utils';

export class ActionTypeRow {
  id: number;
  code: string;
  name: string;
  value: number;
  cooldown: number;
  created_at: DateTime;
  updated_at: DateTime;
  is_user_action: boolean;
}

export type ActionType = {
  [K in keyof ActionTypeRow as SnakeToCamel<K>]: ActionTypeRow[K];
};

type Column = keyof ActionTypeRow;
const defaultColumns: Column[] = Object.keys(ActionTypeRow) as Column[];

export const findAll = () => sql<ActionTypeRow>`
  SELECT 
    ${select(Object.keys(ActionTypeRow))}
  FROM
    action_type;
`;
