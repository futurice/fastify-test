import { IResolvers } from 'mercurius';
import { PrismaSelect } from '../util/PrismaSelect';

const resolvers: IResolvers = {
  Query: {
    guild: (_, __, ctx, info) => {
      const select = new PrismaSelect(info).value;
      return ctx.prisma.guilds.findMany({ ...select });
    },
  },
};

export default resolvers;
