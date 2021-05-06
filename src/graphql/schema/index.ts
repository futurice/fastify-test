import { GraphQLSchema, GraphQLScalarType, printSchema } from 'graphql';
import query from './query';
import mutation from './mutation';

export default new GraphQLSchema({
  query,
  mutation,
});
