import { gql } from 'mercurius-codegen';

export default gql`
  scalar DateTime
  scalar Void

  enum Sort {
    NEWEST
    HOT
    BEST
  }

  enum ActionTypes {
    SIMA
    IMAGE
    TEXT
  }

  type Query {
    feed(skip: Int, take: Int, sort: Sort): [FeedItem]!
    guild: [Guild]!
    actionType: [ActionType]!
  }

  input ActionInsertInput {
    text: String
    actionType: ActionTypes
  }

  type Mutation {
    actionInsert(input: ActionInsertInput): Void
  }

  type User {
    name: String
    team: Guild
  }

  type FeedItem {
    id: Int
    text: String
    createdAt: DateTime
    updatedAt: DateTime
    user: User
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
