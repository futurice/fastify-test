import {
  Codec,
  enumeration,
  array,
  string,
  boolean,
  date,
  nullable,
} from 'purify-ts/Codec';

export enum FeedSort {
  New,
  Hot,
}

export const FeedResponse = array(
  Codec.interface({
    uuid: string,
    type: string,
    text: nullable(string),
    image: nullable(string),
    isSticky: boolean,
    createdAt: date,
    updatedAt: date,
    author: nullable(
      Codec.interface({
        name: string,
        guild: nullable(string),
      }),
    ),
  }),
);

export const FeedQuery = Codec.interface({
  orderBy: enumeration(FeedSort),
});
