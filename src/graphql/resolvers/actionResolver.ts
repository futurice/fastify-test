import {
  Resolver,
  Arg,
  Mutation,
  InputType,
  Ctx,
  Field,
  ObjectType,
} from 'type-graphql';
import { MercuriusContext } from 'mercurius';
import { registerEnumType } from 'type-graphql';
import * as action from '../../queries/action';

enum ActionTypes {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

registerEnumType(ActionTypes, {
  name: 'InsertActionType',
});

@InputType()
class ActionsInsertInput {
  @Field({ nullable: true })
  imageData: string;

  @Field({ nullable: true })
  text: string;

  @Field(() => ActionTypes)
  type: ActionTypes;
}

@ObjectType()
class ActionInsertResult {
  @Field()
  success: boolean;
}

Resolver();
export class ActionResolver {
  @Mutation(() => ActionInsertResult)
  async insertAction(
    @Arg('data', type => ActionsInsertInput) data: ActionsInsertInput,
    @Ctx() ctx: MercuriusContext,
  ): Promise<ActionInsertResult> {
    return await ctx.db
      .transaction(async trx => {
        // TODO Upload image somewhere™
        const result = await ctx.db.one(
          action.create({
            userId: ctx.user.id,
            actionTypeCode: data.type,
            imagePath: data.imageData ?? null,
            text: data.text ?? null,
          }),
        );
      })
      .then(() => ({
        success: true,
      }));
  }
}
