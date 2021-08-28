import { Codec, enumeration, boolean } from 'purify-ts/Codec';

export enum FeedSort {
  New,
  Hot,
}

export const FeedResponse = Codec.interface({
  ok: boolean,
});

export const FeedQuery = Codec.interface({
  orderBy: enumeration(FeedSort),
});
