import {
  Codec,
  optional,
  array,
  string,
  boolean,
  date,
  nullable,
  enumeration,
} from 'purify-ts/Codec';
import { NumberRangedIn } from 'purify-ts-extra-codec';

export enum FeedSort {
  New = 'NEW',
  Hot = 'HOT',
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
  limit: optional(NumberRangedIn({ gte: 1, lte: 100 })),
  orderBy: optional(enumeration(FeedSort)),
});
