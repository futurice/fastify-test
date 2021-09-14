import {
  Codec,
  array,
  string,
  boolean,
  date,
  nullable,
  enumeration,
} from 'purify-ts/Codec';
import {
  NumberRangedIn,
  NonEmptyString,
  StringLengthRangedIn,
  Integer,
} from 'purify-ts-extra-codec';
import { optionalWithDefault } from '../../../../utils/codec';

export enum FeedSort {
  New = 'NEW',
  Hot = 'HOT',
}
const author = Codec.interface({
  name: string,
  guild: string,
});

export const FeedResponse = array(
  Codec.interface({
    uuid: string,
    type: string,
    text: nullable(string),
    image: nullable(string),
    isSticky: boolean,
    createdAt: date,
    updatedAt: date,
    commentCount: Integer,
    author: nullable(author),
  }),
);

export const FeedQuery = Codec.interface({
  limit: optionalWithDefault(NumberRangedIn({ gte: 1, lte: 100 }), 50),
  orderBy: optionalWithDefault(enumeration(FeedSort), FeedSort.Hot),
});

export const CreateCommentParams = Codec.interface({
  feedItemUuid: NonEmptyString,
});

export const CreateCommentInput = Codec.interface({
  text: StringLengthRangedIn({ gt: 0, lte: 1000 }),
});

export const CreateCommentResponse = Codec.interface({
  uuid: NonEmptyString,
});

export const GetFeedItemParams = Codec.interface({
  feedItemUuid: NonEmptyString,
});

export const FeedOneResponse = Codec.interface({
  uuid: string,
  type: string,
  text: nullable(string),
  image: nullable(string),
  createdAt: date,
  updatedAt: date,
  author: nullable(author),
  comments: array(
    Codec.interface({
      uuid: string,
      text: string,
      createdAt: string,
      author: author,
    }),
  ),
});
