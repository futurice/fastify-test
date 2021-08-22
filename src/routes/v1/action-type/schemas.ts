import { Type } from '@sinclair/typebox';

export const actionTypeResponseSchema = Type.Array(
  Type.Object({
    code: Type.String(),
    name: Type.String(),
    cooldown: Type.Number(),
  }),
);
