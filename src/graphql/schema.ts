import { gql } from 'mercurius-codegen';

export default gql`
  scalar DateTime

  enum Sort {
    NEWEST
    HOT
    BEST
  }

  type Query {
    feed(skip: Int, take: Int, sort: Sort): [FeedItem]!
  }

  type FeedItem {
    id: Int
    content: String
    createdAt: DateTime
    updatedAt: DateTime
  }
`;
