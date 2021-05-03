import gql from 'graphql-tag';

export default gql`
  scalar DateTime
  scalar Void

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

  input ActionInsertInput {
    text: String
  }

  type Mutation {
    actionInsert(input: ActionInsertInput): Void
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
