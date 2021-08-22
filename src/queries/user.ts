import { sql } from 'slonik';

export type User = {
  id: number;
  uuid: string;
  name: string;
  teamId: number;
  isBanned: boolean;
};

export const findById = (uuid: string) => sql<User>`
  SELECT id, uuid, name, team_id as teamId, is_banned AS isBanned FROM users WHERE uuid=${uuid}
`;
