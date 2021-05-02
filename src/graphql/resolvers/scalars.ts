import { IResolvers } from 'mercurius';
import { DateTimeResolver } from 'graphql-scalars';

const resolvers: IResolvers = {
  DateTime: DateTimeResolver,
};

export default resolvers;
