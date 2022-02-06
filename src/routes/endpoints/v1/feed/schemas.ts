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
  StringLengthRangedIn,
  Integer,
} from 'purify-ts-extra-codec';
import { optionalWithDefault, uuid } from '../../../../utils/codec';

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
    uuid: uuid,
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

export const feedQuery = Codec.interface({
  limit: optionalWithDefault(NumberRangedIn({ gte: 1, lte: 100 }), 50),
  orderBy: optionalWithDefault(enumeration(FeedSort), FeedSort.Hot),
});

export const createCommentParams = Codec.interface({
  feedItemUuid: uuid,
});

export const createCommentDTO = Codec.interface({
  text: StringLengthRangedIn({ gt: 0, lte: 1000 }),
});

export const createCommentResponse = Codec.interface({
  uuid: uuid,
});

export const getFeedItemParams = Codec.interface({
  feedItemUuid: uuid,
});

export const feedOneResponse = Codec.interface({
  uuid: uuid,
  type: string,
  text: nullable(string),
  image: nullable(string),
  createdAt: date,
  updatedAt: date,
  author: nullable(author),
  comments: array(
    Codec.interface({
      uuid: uuid,
      text: string,
      createdAt: string,
      author: author,
    }),
  ),
});
