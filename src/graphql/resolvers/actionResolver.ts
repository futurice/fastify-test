import { IResolvers } from 'mercurius';
import * as yup from 'yup';

const actionInsertSchema = yup.object().shape({});

const resolvers: IResolvers = {
  Mutation: {
    actionInsert: (root, args, ctx, info) => {
      const input = actionInsertSchema.validateSync(args.input);
      // TODO
      return null;
    },
  },
};

export default resolvers;
