import { Ctx, Query, Resolver } from 'type-graphql';
import { MercuriusContext } from 'mercurius';
import FeedItem from '../types/feedItem';
import * as feedItem from '../../queries/feedItem';

@Resolver()
export class FeedItemResolver {
  @Query(returns => [FeedItem])
  async feedItem(
    @Ctx() ctx: MercuriusContext,
  ) /* : Promise<Readonly<FeedItem[]>>*/ {
    const result = await ctx.db.query(feedItem.findAll());
    return result.rows;
  }
}
