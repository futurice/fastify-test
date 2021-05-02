import { IResolvers } from 'mercurius';

const resolvers: IResolvers = {
  Query: {
    guild: (_, __, ctx) => {
      return ctx.prisma.guilds.findMany();
    },
  },
};

export default resolvers;
