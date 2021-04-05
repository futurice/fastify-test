import { Type } from '@sinclair/typebox';

// eslint-disable-next-line no-shadow
export enum FeedSort {
  New,
  Hot,
}

export const feedResponseSchema = Type.Object({
  ok: Type.Boolean(),
});

export const feedQuerySchema = Type.Object({
  orderBy: Type.String(),
});
