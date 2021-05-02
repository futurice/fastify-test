import { IResolvers } from 'mercurius';
import { DateTimeResolver } from 'graphql-scalars';

const resolvers: IResolvers = {
  DateTime: DateTimeResolver,
  Query: {
    feed: (root, { skip, take }, ctx) => {
      return ctx.prisma.feedItem
        .findMany({
          skip: skip ?? 0,
          take: take ?? 20,
        })
        .then(result => result ?? []);
    },
  },
};

export default resolvers;
