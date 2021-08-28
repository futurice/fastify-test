import { sql } from 'slonik';
import { select, SnakeToCamel } from '../utils';

class UserRow {
  id: number;
  uuid: string;
  name: string;
  team_id: number;
  is_banned: boolean;
}

export type UserType = {
  [K in keyof UserRow as SnakeToCamel<K>]: UserRow[K];
};

export const findById = (uuid: string) => sql<UserType>`
  SELECT *
  FROM users
  WHERE uuid=${uuid}
`;
