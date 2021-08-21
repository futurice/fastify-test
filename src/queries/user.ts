import { sql } from 'slonik';

export const findById = (uuid: string, columns: string = '*') => sql`
  SELECT ${columns} FROM users WHERE uuid=${uuid}
`;
