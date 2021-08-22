import { sql } from 'slonik';
import FeedItem from '../graphql/types/feedItem';

export const findAll = () => sql<FeedItem>`
  SELECT
    uuid,
    text,
    image
  FROM
    feed_item
`;
