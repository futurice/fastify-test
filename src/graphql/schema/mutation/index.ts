import { GraphQLObjectType } from 'graphql';
import actionInsert from './actionInsert';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    actionInsert,
  },
});
