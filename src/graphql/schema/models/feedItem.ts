import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';
import { DateTimeResolver, GraphQLBigInt } from 'graphql-scalars';
import user from './user';

export default new GraphQLObjectType({
  name: 'Feed',
  description: 'A list of auto- and user generated content',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Feed item id.',
    },
    text: {
      type: GraphQLString,
      description: 'Feed item text content',
    },
    createdAt: {
      type: new GraphQLNonNull(DateTimeResolver),
      description: 'UTC creation time stamp',
    },
    updatedAt: {
      type: new GraphQLNonNull(DateTimeResolver),
      description: 'UTC update time stamp',
    },
    creator: {
      type: user,
      description:
        'User whose action generated the feed item, or null if item is system generated.',
    },
  },
});
