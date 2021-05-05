import { PrismaSelect } from '../util/PrismaSelect';
import { IResolvers } from 'mercurius';

const resolvers: IResolvers = {
  Query: {
    actionType: (_, __, ctx, info) => {
      const select = new PrismaSelect(info).value;
      return ctx.prisma.actionTypes.findMany({ ...select });
    },
  },
};

export default resolvers;
