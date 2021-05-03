import { IResolvers } from 'mercurius';
import { DateTimeResolver, VoidResolver } from 'graphql-scalars';

const resolvers: IResolvers = {
  DateTime: DateTimeResolver,
  Void: VoidResolver,
};

export default resolvers;
