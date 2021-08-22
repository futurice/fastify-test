import { sql } from 'slonik';
import { DateTime, SnakeToCamel, select } from '../utils';

export class ActionRow {
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

export type ActionType = {
  [K in keyof ActionRow as SnakeToCamel<K>]: ActionRow[K];
};

export type CreateActionInput = {
  userId: number;
  actionTypeCode: string;
  imagePath: string | null;
  text: string | null;
};

export const create = ({
  userId,
  actionTypeCode,
  imagePath,
  text,
}: CreateActionInput) => sql<ActionRow>`
  INSERT INTO action("user_id", "action_type_id", "image_path", "text")
  VALUES (${userId}, (SELECT id FROM action_type WHERE code = ${actionTypeCode}), ${imagePath}, ${text})
  RETURNING ${select(Object.keys(ActionRow))};
`;
