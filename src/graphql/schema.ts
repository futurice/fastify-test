import { gql } from 'mercurius-codegen';

export default gql`
  scalar DateTime

  type Query {
    feed(skip: Int, take: Int): [FeedItem]
  }

  type FeedItem {
    id: Int
    content: String
    createdAt: DateTime
    updatedAt: DateTime
  }
`;
