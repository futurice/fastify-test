import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import { DateTimeResolver } from 'graphql-scalars';

export default new GraphQLObjectType({
  name: 'ActionType',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Action type id.',
    },
    code: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Unique string identifier',
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'User facing name',
    },
    value: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Point value',
    },
    cooldown: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Length of period when action cannot be repeated in ms',
    },
    createdAt: {
      type: new GraphQLNonNull(DateTimeResolver),
      description: 'UTC timestamp of when action toook place',
    },
    updatedAt: {
      type: new GraphQLNonNull(DateTimeResolver),
    },
    isUserAction: {
      description: 'Can a user invoke this action',
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});
