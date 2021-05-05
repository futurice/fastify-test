import { PrismaSelect } from '../util/PrismaSelect';
import { IResolvers } from 'mercurius';
import * as yup from 'yup';
import { Sort } from '../generated/types';

const feedQueryParamSchema = yup.object().shape({
  skip: yup.number().integer().default(0).min(0),
  take: yup.number().integer().max(100).min(0).default(20),
  sort: yup.mixed<Sort>().oneOf(Object.values(Sort)).default(Sort.NEWEST),
});

const resolvers: IResolvers = {
  Query: {
    feed: (_, args, ctx, info) => {
      const { skip, take } = feedQueryParamSchema.validateSync(args);
      const select = new PrismaSelect(info).value;
      return ctx.prisma.feedItems.findMany({
        skip,
        take,
        ...select,
      });
    },
  },
};

export default resolvers;
