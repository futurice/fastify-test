import { Type } from '@sinclair/typebox';

export const FeedItemSchema = Type.Object({
  id: Type.Readonly(Type.Number()),
  content: Type.String(),
  created_at: Type.Readonly(Type.String()),
  updated_at: Type.String(),
});
