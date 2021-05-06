import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { DateTimeResolver } from 'graphql-scalars';
import guild from './guild';

export default new GraphQLObjectType({
  name: 'User',
  description: 'Registered whappuapp user',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'User name',
    },
    createdAt: {
      type: new GraphQLNonNull(DateTimeResolver),
      description: 'UTC creation time stamp',
    },
    guild: {
      type: new GraphQLNonNull(guild),
      description: 'The guild user belongs to.',
    },
  },
});
