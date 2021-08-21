import { sql } from 'slonik';

export const findAll = (columns: string = '*') => sql`
  SELECT ${columns} FROM feed_item
`;
