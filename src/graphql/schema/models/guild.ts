import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

export default new GraphQLObjectType({
  name: 'Guild',
  description: 'Subject association, a.k.a guild',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Guild name',
    },
    logo: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'URL to guild logo',
    },
  },
});
