import { sql } from 'slonik';
import FeedItem from '../graphql/types/feedItem';

type CreateActionInput = {
  userId: number;
  actionTypeCode: string;
  imagePath: string | null;
  text: string | null;
};

type CreateActionResult = {
  id: number;
  userId: number;
  actionTypeId: number;
  imagePath: string | null;
  text: string | null;
  aggregated: boolean;
  createdAt: string;
  updatedAt: string;
  isBanned: boolean;
};

export const create = ({
  userId,
  actionTypeCode,
  imagePath,
  text,
}: CreateActionInput) => sql<CreateActionResult>`
  INSERT INTO action("user_id", "action_type_id", "image_path", "text")
  VALUES (${userId}, (SELECT id FROM action_type WHERE code = ${actionTypeCode}), ${imagePath}, ${text})
  RETURNING *;
`;
