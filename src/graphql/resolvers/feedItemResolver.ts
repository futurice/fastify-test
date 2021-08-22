import { Ctx, Query, Resolver } from 'type-graphql';
import { MercuriusContext } from 'mercurius';
import FeedItem from '../types/feedItem';
import * as feedItem from '../../queries/feedItem';

@Resolver()
export class FeedItemResolver {
  @Query(returns => [FeedItem])
  async feedItem(@Ctx() ctx: MercuriusContext): Promise<Readonly<FeedItem[]>> {
    return await ctx.db.any(feedItem.findAll());
  }
}
