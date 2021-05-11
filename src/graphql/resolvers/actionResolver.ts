import { Resolver, Arg, Mutation, InputType, Ctx, Field } from 'type-graphql';
import { Actions } from '@generated/type-graphql/models';
import { Prisma, Users, FeedItemType } from '@prisma/client';
import { IsNotEmpty, Length, ValidateIf } from 'class-validator';
import { MercuriusContext } from 'mercurius';
import { registerEnumType } from 'type-graphql';

enum ActionTypes {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

registerEnumType(ActionTypes, {
  name: 'InsertActionType',
});

@InputType()
class ActionsInsertInput {
  @Field(type => ActionTypes)
  actionType: ActionTypes;

  @Field({ nullable: true })
  @Length(1, 500)
  @IsNotEmpty()
  text: string;
}

/**
 * @returns Appropriate feed item, or undefined if given action type should not generate a feed item.
 */
const generateFeedItem = (
  user: Users,
  input: ActionsInsertInput,
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

Resolver(of => Actions);
export class ActionsResolver {
  @Mutation(() => Boolean)
  insertAction(
    @Arg('input', type => ActionsInsertInput) input: ActionsInsertInput,
    @Ctx() { prisma, user }: MercuriusContext,
  ): Promise<boolean> {
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
      .then(() => true)
      .catch(err => {
        return false;
      });
  }
}
