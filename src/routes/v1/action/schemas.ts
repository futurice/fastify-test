import { Type } from '@sinclair/typebox';

export enum ActionType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  SIMA = 'SIMA',
}

export const createActionInputSchema = Type.Object({
  imageData: Type.Optional(Type.String()),
  text: Type.Optional(Type.String()),
  type: Type.Enum(ActionType),
});

export const createActionResponseSchema = Type.Object({
  success: Type.Boolean(),
});
