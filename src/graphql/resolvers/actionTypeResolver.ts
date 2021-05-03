import { IResolvers } from 'mercurius';

const resolvers: IResolvers = {
  Query: {
    actionType: (_, args, ctx, info) => {
      return ctx.prisma.actionTypes.findMany();
    },
  },
};

export default resolvers;
