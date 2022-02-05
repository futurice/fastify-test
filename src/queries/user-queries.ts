import { sql } from 'slonik';
import { SnakeToCamel, Transaction } from './utils';
import { query } from './utils';

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

export const findById = query((trx: Transaction, uuid: string) =>
  trx.one(sql<UserType>`
    SELECT *
    FROM users
    WHERE uuid=${uuid}
`),
);

type UserDTO = {
  name: string;
  teamId: number;
};

export const create = query((trx: Transaction, { name, teamId }: UserDTO) => {
  return trx.one(sql<UserType>`
    INSERT INTO users(name, team_id)
    VALUES (${name}, ${teamId})
    RETURNING *;
  `);
});
