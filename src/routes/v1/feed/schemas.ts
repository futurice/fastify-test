import { Type } from '@sinclair/typebox';

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
