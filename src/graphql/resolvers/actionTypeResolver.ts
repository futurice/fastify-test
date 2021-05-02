import { IResolvers } from 'mercurius';

const resolvers: IResolvers = {
  Query: {
    actionType: (_, __, ctx) => {
      return ctx.prisma.actionTypes.findMany();
    },
  },
};

export default resolvers;
