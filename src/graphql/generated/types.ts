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

export type Query = {
  __typename?: "Query";
  feed: Array<Maybe<Feed>>;
  guild: Array<Maybe<Guild>>;
  actionType: Array<Maybe<ActionType>>;
};

export type QueryfeedArgs = {
  sort?: Maybe<Sort>;
};

/** A list of auto- and user generated content */
export type Feed = {
  __typename?: "Feed";
  /** Feed item id. */
  id: Scalars["Int"];
  /** Feed item text content */
  text?: Maybe<Scalars["String"]>;
  /** UTC creation time stamp */
  createdAt: Scalars["DateTime"];
  /** UTC update time stamp */
  updatedAt: Scalars["DateTime"];
  /** User whose action generated the feed item, or null if item is system generated. */
  creator?: Maybe<User>;
};

/** Registered whappuapp user */
export type User = {
  __typename?: "User";
  /** User name */
  name: Scalars["String"];
  /** UTC creation time stamp */
  createdAt: Scalars["DateTime"];
  /** The guild user belongs to. */
  guild: Guild;
};

/** Subject association, a.k.a guild */
export type Guild = {
  __typename?: "Guild";
  id: Scalars["Int"];
  /** Guild name */
  name: Scalars["String"];
  /** URL to guild logo */
  logo: Scalars["String"];
};

/** Feed sorting method */
export enum Sort {
  NEWEST = "NEWEST",
  HOT = "HOT",
  BEST = "BEST",
}

export type ActionType = {
  __typename?: "ActionType";
  /** Action type id. */
  id: Scalars["Int"];
  /** Unique string identifier */
  code: Scalars["String"];
  /** User facing name */
  name: Scalars["String"];
  /** Point value */
  value: Scalars["Int"];
  /** Length of period when action cannot be repeated in ms */
  cooldown: Scalars["Int"];
  /** UTC timestamp of when action toook place */
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  /** Can a user invoke this action */
  isUserAction: Scalars["Boolean"];
};

export type Mutation = {
  __typename?: "Mutation";
  actionInsert?: Maybe<Scalars["Void"]>;
};

export type MutationactionInsertArgs = {
  input: actionInsertInput;
};

export type actionInsertInput = {
  actionType: ActionTypes;
  text?: Maybe<Scalars["String"]>;
};

export enum ActionTypes {
  SIMA = "SIMA",
  IMAGE = "IMAGE",
  TEXT = "TEXT",
}

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
  Query: ResolverTypeWrapper<{}>;
  Feed: ResolverTypeWrapper<Feed>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]>;
  User: ResolverTypeWrapper<User>;
  Guild: ResolverTypeWrapper<Guild>;
  Sort: Sort;
  ActionType: ResolverTypeWrapper<ActionType>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Mutation: ResolverTypeWrapper<{}>;
  Void: ResolverTypeWrapper<Scalars["Void"]>;
  actionInsertInput: actionInsertInput;
  ActionTypes: ActionTypes;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  Feed: Feed;
  Int: Scalars["Int"];
  String: Scalars["String"];
  DateTime: Scalars["DateTime"];
  User: User;
  Guild: Guild;
  ActionType: ActionType;
  Boolean: Scalars["Boolean"];
  Mutation: {};
  Void: Scalars["Void"];
  actionInsertInput: actionInsertInput;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  feed?: Resolver<
    Array<Maybe<ResolversTypes["Feed"]>>,
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

export type FeedResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Feed"] = ResolversParentTypes["Feed"]
> = {
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  guild?: Resolver<ResolversTypes["Guild"], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuildResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Guild"] = ResolversParentTypes["Guild"]
> = {
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  logo?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ActionTypeResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["ActionType"] = ResolversParentTypes["ActionType"]
> = {
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  value?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  cooldown?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>;
  isUserAction?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  actionInsert?: Resolver<
    Maybe<ResolversTypes["Void"]>,
    ParentType,
    ContextType,
    RequireFields<MutationactionInsertArgs, "input">
  >;
};

export interface VoidScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Void"], any> {
  name: "Void";
}

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>;
  Feed?: FeedResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Guild?: GuildResolvers<ContextType>;
  ActionType?: ActionTypeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Void?: GraphQLScalarType;
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
  Feed?: {
    id?: LoaderResolver<Scalars["Int"], Feed, {}, TContext>;
    text?: LoaderResolver<Maybe<Scalars["String"]>, Feed, {}, TContext>;
    createdAt?: LoaderResolver<Scalars["DateTime"], Feed, {}, TContext>;
    updatedAt?: LoaderResolver<Scalars["DateTime"], Feed, {}, TContext>;
    creator?: LoaderResolver<Maybe<User>, Feed, {}, TContext>;
  };

  User?: {
    name?: LoaderResolver<Scalars["String"], User, {}, TContext>;
    createdAt?: LoaderResolver<Scalars["DateTime"], User, {}, TContext>;
    guild?: LoaderResolver<Guild, User, {}, TContext>;
  };

  Guild?: {
    id?: LoaderResolver<Scalars["Int"], Guild, {}, TContext>;
    name?: LoaderResolver<Scalars["String"], Guild, {}, TContext>;
    logo?: LoaderResolver<Scalars["String"], Guild, {}, TContext>;
  };

  ActionType?: {
    id?: LoaderResolver<Scalars["Int"], ActionType, {}, TContext>;
    code?: LoaderResolver<Scalars["String"], ActionType, {}, TContext>;
    name?: LoaderResolver<Scalars["String"], ActionType, {}, TContext>;
    value?: LoaderResolver<Scalars["Int"], ActionType, {}, TContext>;
    cooldown?: LoaderResolver<Scalars["Int"], ActionType, {}, TContext>;
    createdAt?: LoaderResolver<Scalars["DateTime"], ActionType, {}, TContext>;
    updatedAt?: LoaderResolver<Scalars["DateTime"], ActionType, {}, TContext>;
    isUserAction?: LoaderResolver<Scalars["Boolean"], ActionType, {}, TContext>;
  };
}
declare module "mercurius" {
  interface IResolvers
    extends Resolvers<import("mercurius").MercuriusContext> {}
  interface MercuriusLoaders extends Loaders {}
}
