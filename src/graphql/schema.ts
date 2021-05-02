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
    guild: [Guild]!
    actionType: [ActionType]!
  }

  type FeedItem {
    id: Int
    content: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Guild {
    id: Int
    name: String
    logo: String
  }

  type ActionType {
    id: Int
    code: String
    name: String
    value: Int
    cooldown: Int
    createdAt: DateTime
    updatedAt: DateTime
    isUserAction: Boolean
  }
`;
