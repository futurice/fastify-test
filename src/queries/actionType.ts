import { sql } from 'slonik';
import ActionType from '../graphql/types/actionType';
import { DBRow, select } from './utils';

type ActionTypeDBRow = DBRow<ActionType>;

const columns: ActionTypeDBRow[] = [
  'id',
  'code',
  'name',
  'cooldown',
  'created_at',
];

export const findAll = () => sql<ActionType>`
  SELECT 
    ${select(columns)}
  FROM
    action_type;
`;
