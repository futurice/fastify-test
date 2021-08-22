import { Ctx, Query, Resolver } from 'type-graphql';
import { MercuriusContext } from 'mercurius';
import ActionType from '../types/actionType';
import * as actionType from '../../queries/actionType';

@Resolver()
export class ActionTypeResolver {
  @Query(returns => [ActionType])
  async actionType(
    @Ctx() ctx: MercuriusContext,
  ): Promise<Readonly<ActionType[]>> {
    const result = await ctx.db.any(actionType.findAll());
    console.log(result);
    return result;
  }
}
