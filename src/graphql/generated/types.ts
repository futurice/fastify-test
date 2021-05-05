import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) =>
  | Promise<import("mercurius-codegen").DeepPartial<TResult>>
  | import("mercurius-codegen").DeepPartial<TResult>;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** Represents NULL values */
  Void: any;
  _FieldSet: any;
};

export enum Sort {
  NEWEST = "NEWEST",
  HOT = "HOT",
  BEST = "BEST",
}

export enum ActionTypes {
  SIMA = "SIMA",
  IMAGE = "IMAGE",
  TEXT = "TEXT",
}

export type Query = {
  __typename?: "Query";
  feed: Array<Maybe<FeedItem>>;
  guild: Array<Maybe<Guild>>;
  actionType: Array<Maybe<ActionType>>;
};

export type QueryfeedArgs = {
  skip?: Maybe<Scalars["Int"]>;
  take?: Maybe<Scalars["Int"]>;
  sort?: Maybe<Sort>;
};

export type ActionInsertInput = {
  text?: Maybe<Scalars["String"]>;
  actionType?: Maybe<ActionTypes>;
};

export type Mutation = {
  __typename?: "Mutation";
  actionInsert?: Maybe<Scalars["Void"]>;
};

export type MutationactionInsertArgs = {
  input?: Maybe<ActionInsertInput>;
};

export type User = {
  __typename?: "User";
  name?: Maybe<Scalars["String"]>;
  team?: Maybe<Guild>;
};

export type FeedItem = {
  __typename?: "FeedItem";
  id?: Maybe<Scalars["Int"]>;
  text?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
  user?: Maybe<User>;
};

export type Guild = {
  __typename?: "Guild";
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  logo?: Maybe<Scalars["String"]>;
};

export type ActionType = {
  __typename?: "ActionType";
  id?: Maybe<Scalars["Int"]>;
  code?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  value?: Maybe<Scalars["Int"]>;
  cooldown?: Maybe<Scalars["Int"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  updatedAt?: Maybe<Scalars["DateTime"]>;
  isUserAction?: Maybe<Scalars["Boolean"]>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]>;
  Void: ResolverTypeWrapper<Scalars["Void"]>;
  Sort: Sort;
  ActionTypes: ActionTypes;
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  ActionInsertInput: ActionInsertInput;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Mutation: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  FeedItem: ResolverTypeWrapper<FeedItem>;
  Guild: ResolverTypeWrapper<Guild>;
  ActionType: ResolverTypeWrapper<ActionType>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  DateTime: Scalars["DateTime"];
  Void: Scalars["Void"];
  Query: {};
  Int: Scalars["Int"];
  ActionInsertInput: ActionInsertInput;
  String: Scalars["String"];
  Mutation: {};
  User: User;
  FeedItem: FeedItem;
  Guild: Guild;
  ActionType: ActionType;
  Boolean: Scalars["Boolean"];
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export interface VoidScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Void"], any> {
  name: "Void";
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  feed?: Resolver<
    Array<Maybe<ResolversTypes["FeedItem"]>>,
    ParentType,
    ContextType,
    RequireFields<QueryfeedArgs, never>
  >;
  guild?: Resolver<
    Array<Maybe<ResolversTypes["Guild"]>>,
    ParentType,
    ContextType
  >;
  actionType?: Resolver<
    Array<Maybe<ResolversTypes["ActionType"]>>,
    ParentType,
    ContextType
  >;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  actionInsert?: Resolver<
    Maybe<ResolversTypes["Void"]>,
    ParentType,
    ContextType,
    RequireFields<MutationactionInsertArgs, never>
  >;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes["Guild"]>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedItemResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["FeedItem"] = ResolversParentTypes["FeedItem"]
> = {
  id?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  user?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Guild"] = ResolversParentTypes["Guild"]
> = {
  id?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  logo?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActionTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["ActionType"] = ResolversParentTypes["ActionType"]
> = {
  id?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  cooldown?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  createdAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  isUserAction?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType;
  Void?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  FeedItem?: FeedItemResolvers<ContextType>;
  Guild?: GuildResolvers<ContextType>;
  ActionType?: ActionTypeResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

type Loader<TReturn, TObj, TParams, TContext> = (
  queries: Array<{
    obj: TObj;
    params: TParams;
  }>,
  context: TContext & {
    reply: import("fastify").FastifyReply;
  }
) => Promise<Array<import("mercurius-codegen").DeepPartial<TReturn>>>;
type LoaderResolver<TReturn, TObj, TParams, TContext> =
  | Loader<TReturn, TObj, TParams, TContext>
  | {
      loader: Loader<TReturn, TObj, TParams, TContext>;
      opts?: {
        cache?: boolean;
      };
    };
export interface Loaders<
  TContext = import("mercurius").MercuriusContext & {
    reply: import("fastify").FastifyReply;
  }
> {
  User?: {
    name?: LoaderResolver<Maybe<Scalars["String"]>, User, {}, TContext>;
    team?: LoaderResolver<Maybe<Guild>, User, {}, TContext>;
  };

  FeedItem?: {
    id?: LoaderResolver<Maybe<Scalars["Int"]>, FeedItem, {}, TContext>;
    text?: LoaderResolver<Maybe<Scalars["String"]>, FeedItem, {}, TContext>;
    createdAt?: LoaderResolver<
      Maybe<Scalars["DateTime"]>,
      FeedItem,
      {},
      TContext
    >;
    updatedAt?: LoaderResolver<
      Maybe<Scalars["DateTime"]>,
      FeedItem,
      {},
      TContext
    >;
    user?: LoaderResolver<Maybe<User>, FeedItem, {}, TContext>;
  };

  Guild?: {
    id?: LoaderResolver<Maybe<Scalars["Int"]>, Guild, {}, TContext>;
    name?: LoaderResolver<Maybe<Scalars["String"]>, Guild, {}, TContext>;
    logo?: LoaderResolver<Maybe<Scalars["String"]>, Guild, {}, TContext>;
  };

  ActionType?: {
    id?: LoaderResolver<Maybe<Scalars["Int"]>, ActionType, {}, TContext>;
    code?: LoaderResolver<Maybe<Scalars["String"]>, ActionType, {}, TContext>;
    name?: LoaderResolver<Maybe<Scalars["String"]>, ActionType, {}, TContext>;
    value?: LoaderResolver<Maybe<Scalars["Int"]>, ActionType, {}, TContext>;
    cooldown?: LoaderResolver<Maybe<Scalars["Int"]>, ActionType, {}, TContext>;
    createdAt?: LoaderResolver<
      Maybe<Scalars["DateTime"]>,
      ActionType,
      {},
      TContext
    >;
    updatedAt?: LoaderResolver<
      Maybe<Scalars["DateTime"]>,
      ActionType,
      {},
      TContext
    >;
    isUserAction?: LoaderResolver<
      Maybe<Scalars["Boolean"]>,
      ActionType,
      {},
      TContext
    >;
  };
}
declare module "mercurius" {
  interface IResolvers
    extends Resolvers<import("mercurius").MercuriusContext> {}
  interface MercuriusLoaders extends Loaders {}
}
