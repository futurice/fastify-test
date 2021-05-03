import { IResolvers } from 'mercurius';
import { ActionTypes } from './../generated/types';
import * as yup from 'yup';
import { Prisma, FeedItemType, Users } from '@prisma/client';

const actionInsertSchema = yup.object().shape({
  actionType: yup
    .mixed<ActionTypes>()
    .oneOf(Object.values(ActionTypes))
    .required(),
  text: yup.string().trim().when(['actionType'], {
    is: ActionTypes.TEXT,
    then: yup.string().required(),
    otherwise: yup.string().optional().nullable(),
  }),
});
interface ActionInsertInput extends yup.Asserts<typeof actionInsertSchema> {}

/**
 * @returns Appropriate feed item, or undefined if given action type should not generate a feed item.
 */
const generateFeedItem = (
  user: Users,
  input: ActionInsertInput,
): Prisma.FeedItemsCreateNestedOneWithoutActionInput | undefined => {
  if (input.actionType === ActionTypes.TEXT) {
    return {
      create: {
        text: input.text,
        type: FeedItemType.TEXT,
        user: {
          connect: {
            uuid: user.uuid,
          },
        },
      },
    };
  }

  return undefined;
};

const resolvers: IResolvers = {
  Mutation: {
    actionInsert: (root, args, { user, prisma }, info) => {
      const input = actionInsertSchema.validateSync(args.input);
      const feedItem = generateFeedItem(user as Users, input);

      return prisma.actions
        .create({
          data: {
            actionType: {
              connect: {
                code: input.actionType,
              },
            },
            text: input.text,
            user: {
              connect: {
                uuid: user?.uuid,
              },
            },
            feedItem,
          },
        })
        .then(() => null)
        .catch(err => {
          console.log('HERE', err);
          return null;
        });
    },
  },
};

export default resolvers;
